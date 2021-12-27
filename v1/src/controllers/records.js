const Records = require("../models/records");
const { DateTime } = require("luxon");
const hs = require("http-status");

const list = async (req, res) => {
  const { minCount, maxCount, startDate, endDate } = req.body;
  const formattedStartDate = DateTime.fromISO(startDate, { zone: "GMT" });
  const formattedEndDate = DateTime.fromISO(endDate, { zone: "GMT" });
  if (formattedStartDate.toMillis() >= formattedEndDate.toMillis()) {
    res.status(hs.BAD_REQUEST).json({
      code: 400,
      msg: "startDate must be less or equal endDate",
    });
  }
  if (minCount > maxCount) {
    res.status(hs.BAD_REQUEST).json({
      code: 400,
      msg: "minCount must be less or equal maxCount",
    });
  }
  Records.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(req.body.startDate),
          $lt: new Date(req.body.endDate),
        },
      },
    },
    {
      $unwind: "$counts",
    },
    {
      $group: {
        _id: {
          key: "$key",
          createdAt: "$createdAt",
        },
        totalCount: {
          $sum: "$counts",
        },
      },
    },
    {
      $project: {
        _id: 0,
        key: "$_id.key",
        createdAt: "$_id.createdAt",
        totalCount: 1,
      },
    },
  ]).then((data) => {
    let records = [];

    data.map((res) => {
      if (
        res.totalCount >= req.body.minCount &&
        res.totalCount <= req.body.maxCount
      ) {
        const obj = {
          key: res.key,
          createdAt: res.createdAt,
          totalCount: res.totalCount,
        };
        records.push(obj);
      }
    });

    if (records.length == 0) {
      res.status(500).json({
        code: 1,
        msg: "No records found!",
        records: records,
      });
    } else {
      res.status(200).json({
        code: 0,
        msg: "Success",
        records: records,
      });
    }
  });
};

module.exports = {
  list,
};
