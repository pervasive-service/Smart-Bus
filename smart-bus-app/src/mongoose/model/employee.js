const mongoose = require('mongoose');

// Define employee schema
const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
        // validate: {
        //   validator: function(v) {
        //     // Regular expression to validate employee ID format (example: EMP001)
        //     return /^EMP\d{3}$/i.test(v);
        //   },
        //   message: props => `${props.value} is not a valid employee ID!`
        // }
      },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    // required: true,
    unique: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Regular expression to validate email format
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String
    // enum: ['Male', 'Female', 'Other']
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  address: {
    type: String
    // No longer marked as required
  },
  salary: {
    type: Number
    // required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  workLocation: {
    type: String
    // No longer marked as required
  },
  workSchedule: {
    type: String
    // No longer marked as required
  },
  emergencyContact: {
    name: String,
    relationship: String,
    contact: String
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  performanceRatings: [{
    date: Date,
    rating: Number
  }],
  leaveBalance: {
    vacation: Number,
    sickLeave: Number,
    personalLeave: Number
  },
  benefits: [{
    type: String,
    details: String
  }],
  probationPeriod: {
    startDate: Date,
    endDate: Date
  }
}, { timestamps: true });

  employeeSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
  });
  
  const Employee = mongoose.model('Employee', employeeSchema);
  
  module.exports = Employee;
