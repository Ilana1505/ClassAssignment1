const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`); // הצלחה בחיבור
    } catch (err) {
        console.error(`Error: ${err.message}`); // שגיאה בחיבור
        process.exit(1); // שגיאה
    }
};

module.exports = connectDB;


