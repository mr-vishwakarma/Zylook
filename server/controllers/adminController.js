import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Outfit from '../models/Outfit.js';
import { ApiError } from '../utils/apiError.js';

/**
 * @desc    Get dashboard KPI stats
 * @route   GET /api/admin/stats
 * @access  Admin only
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalProducts,
      totalOutfits,
      totalOrders,
      todayOrders,
      todayRevenue,
      lowStockProducts,
      pendingReturns,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Outfit.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart }, 'payment.status': 'paid' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } },
      ]),
      Product.countDocuments({
        isActive: true,
        'sizes.stock': { $lte: 5 },
      }),
      Order.countDocuments({ status: 'returned' }),
      Order.find()
        .populate('user', 'name email avatar')
        .sort('-createdAt')
        .limit(5)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOutfits,
        totalOrders,
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
        lowStockProducts,
        pendingReturns,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get revenue analytics (by day/week/month)
 * @route   GET /api/admin/analytics/revenue
 * @access  Admin only
 */
export const getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;

    let daysBack = 7;
    if (period === '30d') daysBack = 30;
    if (period === '90d') daysBack = 90;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    startDate.setHours(0, 0, 0, 0);

    const revenueByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'payment.status': 'paid',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$finalAmount' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$finalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ success: true, data: revenueByDay });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order analytics (by category)
 * @route   GET /api/admin/analytics/orders
 * @access  Admin only
 */
export const getOrderAnalytics = async (req, res, next) => {
  try {
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$finalAmount' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const ordersByMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$finalAmount' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      success: true,
      data: { ordersByStatus, ordersByMonth },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user analytics
 * @route   GET /api/admin/analytics/users
 * @access  Admin only
 */
export const getUserAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [usersByRole, newUsersThisMonth, signupsByDay] = await Promise.all([
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: { usersByRole, newUsersThisMonth, signupsByDay },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (admin user management)
 * @route   GET /api/admin/users
 * @access  Admin only
 */
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user role
 * @route   PATCH /api/admin/users/:id/role
 * @access  Admin only
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'creator', 'admin'].includes(role)) {
      throw new ApiError('Invalid role. Must be user, creator, or admin', 400);
    }

    // Prevent admin from demoting themselves
    if (req.params.id === req.user._id.toString()) {
      throw new ApiError('Cannot change your own role', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get top performing outfits
 * @route   GET /api/admin/analytics/top-outfits
 * @access  Admin only
 */
export const getTopOutfits = async (req, res, next) => {
  try {
    const topOutfits = await Outfit.find({ isActive: true })
      .sort('-purchaseCount')
      .limit(10)
      .select('title coverImage bundlePrice purchaseCount viewCount avgRating')
      .lean();

    res.status(200).json({ success: true, data: topOutfits });
  } catch (error) {
    next(error);
  }
};
