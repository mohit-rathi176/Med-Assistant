const { array } = require('joi');
const mongoose = require('mongoose');

const prescriptionSchema = mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true,
        min: 4,
        max: 15
    },
    medicine: {
        type: [],
        required: true
    },
    parameter: {
        type: [],
        required: true
    }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
