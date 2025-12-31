const logger = require('../../utils/logger');
const AuditService = require('../audit/AuditService');
class ShiftStateMachine {
constructor() {
this.states = {
PLANNED: 'planned',
ACTIVE: 'active',
COMPLETED: 'completed',
MISSED: 'missed',
EXCEPTION: 'exception'
};
this.transitions = {
[this.states.PLANNED]: {
checkIn: {
target: this.states.ACTIVE,
condition: this.isWithinGracePeriod.bind(this),
onTransition: this.handleCheckIn.bind(this)
},
checkInLate: {
target: this.states.EXCEPTION,
condition: (shift) => !this.isWithinGracePeriod(shift),
onTransition: this.handleLateCheckIn.bind(this)
},
autoMiss: {
target: this.states.MISSED,
condition: this.isPastMissedThreshold.bind(this),
auto: true,
onTransition: this.handleAutoMiss.bind(this)
},
adminOverride: {
target: this.states.EXCEPTION,
onTransition: this.handleAdminOverride.bind(this)
}
},
[this.states.ACTIVE]: {
checkOut: {
target: this.states.COMPLETED,
condition: this.isNearShiftEnd.bind(this),
 onTransition: this.handleCheckOut.bind(this)
        },
        checkOutEarly: {
          target: this.states.EXCEPTION,
          condition: (shift) => !this.isNearShiftEnd(shift),
          onTransition: this.handleEarlyCheckOut.bind(this)
        },
        adminOverride: {
          target: this.states.EXCEPTION,
          onTransition: this.handleAdminOverride.bind(this)
        }
      },
      [this.states.MISSED]: {
        adminOverride: {
          target: this.states.EXCEPTION,
          onTransition: this.handleAdminOverride.bind(this)
        }
      },
      [this.states.EXCEPTION]: {
        adminComplete: {
          target: this.states.COMPLETED,
          onTransition: this.handleAdminCompletion.bind(this)
        }
      }
    };
  }
  // Transition validation and execution
  async transition(shift, action, user, data = {}) {
    const currentState = shift.status;
    const transition = this.transitions[currentState]?.[action];
    if (!transition) {
      throw new Error(`Invalid transition: ${currentState} -> ${action}`);
    }
    // Check condition if exists
    if (transition.condition && !transition.condition(shift, data)) {
      throw new Error(`Transition condition not met for ${action}`);
    }
    // Execute transition
    const result = await transition.onTransition(shift, user, data);
    
    // Log transition
    await AuditService.logAction(user.id, 'shift.transition', 'shift', shift.id, {
      from: currentState,
      to: transition.target,
action,
data
});
logger.info(`Shift ${shift.id} transitioned from ${currentState} to ${transition.
target} by user ${user.id}`);
return result;
}
// Conditions
isWithinGracePeriod(shift) {
const graceMinutes = 15; // Configurable
const shiftDateTime = new Date(`${shift.date}T${shift.start_time}`);
const now = new Date();
const diffMinutes = (now - shiftDateTime) / (1000 * 60);
return diffMinutes <= graceMinutes && diffMinutes >= -5; // Allow 5min early
}
isPastMissedThreshold(shift) {
const missedThresholdMinutes = 60; // Mark as missed after 1 hour
const shiftDateTime = new Date(`${shift.date}T${shift.start_time}`);
const now = new Date();
return (now - shiftDateTime) / (1000 * 60) > missedThresholdMinutes;
}
isNearShiftEnd(shift) {
const earlyCheckoutWindow = 30; // Minutes before end time
const shiftEndDateTime = new Date(`${shift.date}T${shift.end_time}`);
const now = new Date();
return (shiftEndDateTime - now) / (1000 * 60) <= earlyCheckoutWindow;
}
// Transition handlers
async handleCheckIn(shift, user, data) {
const now = new Date();
const shiftDateTime = new Date(`${shift.date}T${shift.start_time}`);
const lateMinutes = Math.max(0, (now - shiftDateTime) / (1000 * 60));
shift.status = this.states.ACTIVE;
shift.actual_start_time = now;
shift.late_minutes = Math.round(lateMinutes);
await shift.save();
return shift;
}
async handleLateCheckIn(shift, user, data) {
const now = new Date();
const shiftDateTime = new Date(`${shift.date}T${shift.start_time}`);
const lateMinutes = (now - shiftDateTime) / (1000 * 60);
shift.status = this.states.EXCEPTION;
shift.actual_start_time = now;
shift.late_minutes = Math.round(lateMinutes);
shift.notes = data.reason || 'Late check-in';
await shift.save();
return shift;
}
async handleCheckOut(shift, user, data) {
const now = new Date();
const shiftEndDateTime = new Date(`${shift.date}T${shift.end_time}`);
const earlyExitMinutes = Math.max(0, (shiftEndDateTime - now) / (1000 * 60));
shift.status = this.states.COMPLETED;
shift.actual_end_time = now;
shift.early_exit_minutes = Math.round(earlyExitMinutes);
await shift.save();
return shift;
}
async handleEarlyCheckOut(shift, user, data) {
const now = new Date();
const shiftEndDateTime = new Date(`${shift.date}T${shift.end_time}`);
const earlyExitMinutes = (shiftEndDateTime - now) / (1000 * 60);
shift.status = this.states.EXCEPTION;
shift.actual_end_time = now;
shift.early_exit_minutes = Math.round(earlyExitMinutes);
shift.notes = data.reason || 'Early check-out';
await shift.save();
return shift;
}
async handleAutoMiss(shift) {
shift.status = this.states.MISSED;
shift.notes = 'Automatically marked as missed';
await shift.save();
return shift;
 }
  async handleAdminOverride(shift, user, data) {
    shift.status = this.states.EXCEPTION;
    shift.notes = data.reason || `Manual override by ${user.full_name}`;
    
    if (data.actual_start_time) {
      shift.actual_start_time = data.actual_start_time;
    }
    if (data.actual_end_time) {
      shift.actual_end_time = data.actual_end_time;
    }
    await shift.save();
    return shift;
  }
  async handleAdminCompletion(shift, user, data) {
    shift.status = this.states.COMPLETED;
    shift.notes = data.reason || `Marked completed by ${user.full_name}`;
    await shift.save();
    return shift;
  }
  // Auto-transition scheduler
  async processAutoTransitions() {
    const { Shift, Assignment } = require('../../models');
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    try {
      // Find shifts that need auto-transition
      const shifts = await Shift.findAll({
        where: {
          date: today,
          status: this.states.PLANNED
        },
        include: [{
          model: Assignment,
          as: 'assignment',
          required: true
        }]
      });
      for (const shift of shifts) {
        if (this.isPastMissedThreshold(shift)) {
          await this.transition(shift, 'autoMiss', { id: 0, full_name: 'System' });
          }
}
logger.info(`Processed auto-transitions for ${shifts.length} shifts`);
} catch (error) {
logger.error('Error processing auto-transitions:', error);
}
}
}
module.exports = new ShiftStateMachine();