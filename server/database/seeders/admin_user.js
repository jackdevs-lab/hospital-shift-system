const bcrypt = require('bcryptjs');
module.exports = {
up: async (queryInterface, Sequelize) => {
// Create departments first
const departments = await queryInterface.bulkInsert('departments', [
{
name: 'Emergency Room',
code: 'ER',
description: 'Emergency and trauma care',
created_at: new Date(),
updated_at: new Date()
},
{
name: 'Cardiology',
code: 'CARD',
description: 'Heart and cardiovascular care',
created_at: new Date(),
updated_at: new Date()},
      {
        name: 'Surgery',
        code: 'SURG',
        description: 'Surgical operations',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pediatrics',
        code: 'PEDS',
        description: 'Child healthcare',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Orthopedics',
        code: 'ORTHO',
        description: 'Bone and joint care',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { returning: true });
    // Create users
    const passwordHash = await bcrypt.hash('Password123!', 10);
    
    const users = await queryInterface.bulkInsert('users', [
      {
        email: 'admin@hospital.com',
        password_hash: passwordHash,
        full_name: 'Super Admin',
        role: 'super_admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'hr@hospital.com',
        password_hash: passwordHash,
        full_name: 'HR Manager',
        role: 'hr_admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
{
  email: 'doctor@hospital.com',
  password_hash: passwordHash,
  full_name: 'Dr. Sarah Chen',
  role: 'doctor',
  department_id: departments[0].id, // ER
  employee_id: 'DOC001',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
},
{
  email: 'doctor2@hospital.com',
  password_hash: passwordHash,
  full_name: 'Dr. Michael Rodriguez',
  role: 'doctor',
  department_id: departments[1].id, // Cardiology
  employee_id: 'DOC002',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
},
{
  email: 'doctor3@hospital.com',
  password_hash: passwordHash,
  full_name: 'Dr. James Wilson',
  role: 'doctor',
  department_id: departments[2].id, // Surgery
  employee_id: 'DOC003',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
}
], { returning: true });
// Create sample shifts for today
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
await queryInterface.bulkInsert('shifts', [
{
date: today.toISOString().split('T')[0],
start_time: '08:00',
end_time: '16:00',
shift_type: 'day',
department_id: departments[0].id,
status: 'planned', created_by: users[1].id, // HR Manager
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        date: today.toISOString().split('T')[0],
        start_time: '16:00',
        end_time: '00:00',
        shift_type: 'night',
        department_id: departments[1].id,
        status: 'planned',
        created_by: users[1].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        date: tomorrow.toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '17:00',
        shift_type: 'day',
        department_id: departments[2].id,
        status: 'planned',
        created_by: users[1].id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { returning: true });
    // Assign doctors to shifts
    const shifts = await queryInterface.sequelize.query(
      'SELECT id FROM shifts ORDER BY created_at DESC',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    await queryInterface.bulkInsert('assignments', [
      {
        shift_id: shifts[0].id,
        doctor_id: users[2].id, // Dr. Sarah Chen
        assigned_by: users[1].id, // HR Manager
        reassigned: false,
        assigned_at: new Date()
      },
    {
      shift_id: shifts[1].id,
      doctor_id: users[3].id, // Dr. Michael Rodriguez
      assigned_by: users[1].id,
      reassigned: false,
      assigned_at: new Date()
    },
    {
      shift_id: shifts[2].id,
      doctor_id: users[4].id, // Dr. James Wilson
      assigned_by: users[1].id,
      reassigned: false,
      assigned_at: new Date()
    }
  ]);
},
down: async (queryInterface, Sequelize) => {
await queryInterface.bulkDelete('assignments', null, {});
await queryInterface.bulkDelete('shifts', null, {});
await queryInterface.bulkDelete('users', null, {});
await queryInterface.bulkDelete('departments', null, {});
}
};