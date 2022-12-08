let mongoose = require('mongoose');
let donvitructhuoc = mongoose.Schema({
   tendonvi: {
        type: String,
        required: true
    },
    thutu: {
          type: Number,
          required: true
    },
    donvi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donvi"
    }
},  { timestamps: true });
var Donvitructhuoc = mongoose.model('Donvitructhuoc', donvitructhuoc);


module.exports = Donvitructhuoc;