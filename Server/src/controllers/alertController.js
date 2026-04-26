import Alert from '../models/alertModel.js';

// @desc    Create a new alert
// @route   POST /api/v1/alerts
export const createAlertController = async (req, res) => {
    try {
        const { from, to, travelType } = req.body;
        const userId = req.user._id;

        if (!from || !to || !travelType) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Check karein ki alert pehle se मौजूद hai ya nahin
        const existingAlert = await Alert.findOne({ user: userId, from, to, travelType });
        if (existingAlert) {
            return res.status(400).json({ success: false, message: 'You have already set an alert for this route.' });
        }

        await Alert.create({ user: userId, from, to, travelType });
        res.status(201).json({ success: true, message: 'Alert set successfully!' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all alerts for the logged-in user
// @route   GET /api/v1/alerts/my-alerts
export const getMyAlertsController = async (req, res) => {
    try {
        const alerts = await Alert.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete an alert
// @route   DELETE /api/v1/alerts/:id
export const deleteAlertController = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);
        if (!alert) {
            return res.status(404).json({ success: false, message: 'Alert not found.' });
        }
        // Security check
        if (alert.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }
        await alert.deleteOne();
        res.status(200).json({ success: true, message: 'Alert removed successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
