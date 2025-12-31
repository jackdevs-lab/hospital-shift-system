const Joi = require('joi');
const shiftSchema = {
create: Joi.object({
date: Joi.date().required().iso(),
start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
shift_type: Joi.string().valid('day', 'night').required(),
department_id: Joi.number().integer().positive().required(),
doctor_id: Joi.number().integer().positive().required(),
notes: Joi.string().max(500).optional()
}),
update: Joi.object({
date: Joi.date().iso().optional(),
start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
shift_type: Joi.string().valid('day', 'night').optional(),
department_id: Joi.number().integer().positive().optional(),
notes: Joi.string().max(500).optional()
}).min(1),
bulkCreate: Joi.array().items(
Joi.object({
date: Joi.date().required().iso(),
start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required
(),
end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
shift_type: Joi.string().valid('day', 'night').required(),
department_id: Joi.number().integer().positive().required(),
doctor_id: Joi.number().integer().positive().required()
})
).max(100),
checkIn: Joi.object({
qr_code: Joi.string().optional(),
method: Joi.string().valid('qr', 'manual').required(),
latitude: Joi.number().min(-90).max(90).optional(),
longitude: Joi.number().min(-180).max(180).optional(),
device_info: Joi.object().optional()
}),
checkOut: Joi.object({
method: Joi.string().valid('manual', 'auto').required(),
notes: Joi.string().max(500).optional()
}),
override: Joi.object({
reason: Joi.string().required().max(1000),
actual_start_time: Joi.date().iso().optional(),
actual_end_time: Joi.date().iso().optional(),
status: Joi.string().valid('completed', 'exception').required()
})
};
module.exports = shiftSchema;