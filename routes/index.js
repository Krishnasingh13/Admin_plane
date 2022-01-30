var express = require("express");
var router = express.Router();

const userModel = require("./users");
const taskModel = require("./task");
const excelJS = require("exceljs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/add_user", function (req, res, next) {
  res.render("add_user");
});

router.post("/add_user", function (req, res, next) {
  userModel
    .create({
      name: req.body.name,
      email: req.body.email,
      mobile_number: req.body.mobile_number,
    })
    .then((addedUser) => {
      res.redirect("/");
    });
});

router.get("/assign_task", function (req, res, next) {
  userModel.find().then((alluser) => {
    res.render("assign_task", { alluser });
  });
});

router.post("/assign_task/:id", function (req, res, next) {
  taskModel
    .create({
      task_name: req.body.task_name,
      task_type: req.body.task_type,
      user: req.params.id,
    })
    .then(() => {
      res.redirect("/");
    });
});

router.get("/download_excel_file", function (req, res, next) {
  taskModel.find().then((allTask) => {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("My Users");
    const path = "./files"; // Path to download excel

    worksheet.columns = [
      { header: "S no.", key: "s_no", width: 10 },
      { header: "User Name", key: "user", width: 10 },
      { header: "Task Name", key: "task_name", width: 10 },
      { header: "Task Type", key: "task_type", width: 10 },
    ];
    let count = 1;
    allTask.forEach((task) => {
      task.s_no = count;
      worksheet.addRow(task);
      count += 1;
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const data = workbook.xlsx.writeFile(`${path}/Tasks-${Math.floor(Math.random()*1000)}.xlsx`);
    res.redirect("/");
  });
});

module.exports = router;
