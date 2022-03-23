import e, { Router } from "express";
import moment from "moment";
import { SP_Category } from "../entity/SP_Category";
import { getConnection, getManager, Like } from "typeorm";
import { StandardParts } from "../entity/SP";
import { SP_TypeItems } from "../entity/SP_TypeItem";
import { LoggerService } from "../LoggerService";
import { PendingParts } from "../entity/SP_Pending";
import { ActivityLog } from "../entity/ActivityLog";
import { User } from "../entity/User";

const logger = new LoggerService("standardparts-api");
const StandardPartRouter = Router();
const SPManager = getManager("standardPartsDB");

async function updateActivityLog(
  date: any,
  erp: any,
  user: number,
  api: string,
  title: string,
  description: string
) {
  var all_activity: any = [];
  const new_id = await SPManager.query(
    `SELECT id FROM standard_parts WHERE erp_code LIKE '${erp}%'`
  );
  console.log(new_id);

  for (let [_index, element] of new_id.entries()) {
    _index++;
    const activityLog = {
      timelog: date,
      title: title,
      std_part_id: element.id,
      description: description,
      user_id: user,
    };
    all_activity.push(activityLog);
  }

  await SPManager.insert(ActivityLog, all_activity)
    .then((data) => {
      logger.info_obj("API: " + api, {
        message: "Activity Log Done",
        status: true,
      });
    })
    .catch((e) => {
      logger.error_obj("API: " + api, {
        message: "Activity Log Error" + e,
        value: all_activity,
        status: false,
      });
    });
}

StandardPartRouter.get("/", async (_req, res) => {
  res.send({ message: "Standard Parts Connected", status: true });
});

// DISPLAY DATA ONLY
StandardPartRouter.get("/getAllSP", async (_req, res) => {
  try {
    await SPManager.createQueryBuilder(StandardParts, "SP")
      .innerJoinAndSelect("SP.user", "U")
      .innerJoinAndSelect("SP.SPCategory", "C")
      .select(["SP.id AS id"])
      .addSelect(["U.fullname AS fullname"])
      .addSelect([
        "C.description AS category_desc",
        "C.category_type AS category_type",
      ])
      .addSelect([
        "SP.erp_code AS erp_code",
        "SP.type_item AS type_item",
        "SP.product_part_number AS product_part_number",
        "SP.greatech_drawing_naming AS greatech_drawing_naming",
        "SP.description AS description",
        "SP.brand AS brand",
        "SP.uom AS uom",
        "SP.folder_location AS folder_location",
        "SP._2d_folder AS _2d_folder",
        "SP._3d_folder AS _3d_folder",
        "SP.solidworks_folder AS solidworks_folder",
        "SP.insert_date AS insert_date",
        "SP.update_date AS update_date",
        "SP.remark AS remark",
        "SP.assign_material AS assign_material",
        "SP.assign_weight AS assign_weight",
        "SP.vendor AS vendor",
        "SP.section AS section",
      ])
      .where("SP.status = 1")
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllSP", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllSP", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllSP", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

StandardPartRouter.post("/getSPBySection", async (req, res) => {
  const { sect } = req.body;
  try {
    await SPManager.createQueryBuilder(StandardParts, "SP")
      .innerJoinAndSelect("SP.user", "U")
      .innerJoinAndSelect("SP.SPCategory", "C")
      .select(["SP.id AS id"])
      .addSelect(["U.fullname AS fullname"])
      .addSelect([
        "C.description AS category_desc",
        "C.category_type AS category_type",
      ])
      .addSelect([
        "SP.erp_code AS erp_code",
        "SP.type_item AS type_item",
        "SP.product_part_number AS product_part_number",
        "SP.greatech_drawing_naming AS greatech_drawing_naming",
        "SP.description AS description",
        "SP.brand AS brand",
        "SP.uom AS uom",
        "SP.folder_location AS folder_location",
        "SP._2d_folder AS _2d_folder",
        "SP._3d_folder AS _3d_folder",
        "SP.solidworks_folder AS solidworks_folder",
        "SP.insert_date AS insert_date",
        "SP.update_date AS update_date",
        "SP.remark AS remark",
        "SP.assign_material AS assign_material",
        "SP.assign_weight AS assign_weight",
        "SP.vendor AS vendor",
        "SP.section AS section",
      ])
      .where("SP.status = 1")
      .andWhere(`SP.section = "${sect}"`)
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getSPBySection", {
          message: "API Done",
          total: data.length,
          value: sect,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getSPBySection", {
          message: "API Error: " + e,
          value: sect,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getSPBySection", {
      message: "API Failed: " + e,
      value: sect,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

StandardPartRouter.post("/getSPByCategorys", async (req, res) => {
  const { part_id } = req.body;
  try {
    await SPManager.createQueryBuilder(StandardParts, "SP")
      .innerJoinAndSelect("SP.user", "U")
      .innerJoinAndSelect("SP.SPCategory", "C")
      .select(["SP.id AS id"])
      .addSelect(["U.fullname AS fullname"])
      .addSelect([
        "C.description AS category_desc",
        "C.category_type AS category_type",
      ])
      .addSelect([
        "SP.erp_code AS erp_code",
        "SP.type_item AS type_item",
        "SP.product_part_number AS product_part_number",
        "SP.greatech_drawing_naming AS greatech_drawing_naming",
        "SP.description AS description",
        "SP.brand AS brand",
        "SP.uom AS uom",
        "SP.folder_location AS folder_location",
        "SP._2d_folder AS _2d_folder",
        "SP._3d_folder AS _3d_folder",
        "SP.solidworks_folder AS solidworks_folder",
        "SP.insert_date AS insert_date",
        "SP.update_date AS update_date",
        "SP.remark AS remark",
        "SP.assign_material AS assign_material",
        "SP.assign_weight AS assign_weight",
        "SP.vendor AS vendor",
        "SP.section AS section",
      ])
      .addSelect(
        "CASE WHEN SP.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .andWhere(`SP.part_id = "${part_id}"`)
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getSPByCategory", {
          message: "API Done",
          total: data.length,
          value: part_id,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getSPByCategory", {
          message: "API Error: " + e,
          value: part_id,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getSPByCategory", {
      message: "API Failed: " + e,
      value: part_id,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

StandardPartRouter.post("/getSPByCategory", async (req, res) => {
  const { part_id } = req.body;
  try {
    await SPManager.createQueryBuilder(StandardParts, "SP")
      .innerJoinAndSelect("SP.user", "U")
      .innerJoinAndSelect("SP.SPCategory", "C")
      .select(["SP.id AS id"])
      .addSelect(["U.fullname AS fullname"])
      .addSelect([
        "C.description AS category_desc",
        "C.category_type AS category_type",
      ])
      .addSelect([
        "SP.erp_code AS erp_code",
        "SP.type_item AS type_item",
        "SP.product_part_number AS product_part_number",
        "SP.greatech_drawing_naming AS greatech_drawing_naming",
        "SP.description AS description",
        "SP.brand AS brand",
        "SP.uom AS uom",
        "SP.folder_location AS folder_location",
        "SP._2d_folder AS _2d_folder",
        "SP._3d_folder AS _3d_folder",
        "SP.solidworks_folder AS solidworks_folder",
        "SP.insert_date AS insert_date",
        "SP.update_date AS update_date",
        "SP.remark AS remark",
        "SP.assign_material AS assign_material",
        "SP.assign_weight AS assign_weight",
        "SP.vendor AS vendor",
        "SP.section AS section",
      ])
      .addSelect(
        "CASE WHEN SP.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("SP.status = 1")
      .andWhere(`SP.part_id = "${part_id}"`)
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getSPByCategory", {
          message: "API Done",
          total: data.length,
          value: part_id,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getSPByCategory", {
          message: "API Error: " + e,
          value: part_id,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getSPByCategory", {
      message: "API Failed: " + e,
      value: part_id,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

StandardPartRouter.post("/getSPByUserID", async (req, res) => {
  const { id } = req.body;
  try {
    await SPManager.createQueryBuilder(StandardParts, "SP")
      .innerJoinAndSelect("SP.user", "U")
      .innerJoinAndSelect("SP.SPCategory", "C")
      .select(["SP.id AS id"])
      .addSelect(["U.fullname AS fullname"])
      .addSelect([
        "C.description AS category_desc",
        "C.category_type AS category_type",
      ])
      .addSelect([
        "SP.erp_code AS erp_code",
        "SP.type_item AS type_item",
        "SP.product_part_number AS product_part_number",
        "SP.greatech_drawing_naming AS greatech_drawing_naming",
        "SP.description AS description",
        "SP.brand AS brand",
        "SP.uom AS uom",
        "SP.folder_location AS folder_location",
        "SP._2d_folder AS _2d_folder",
        "SP._3d_folder AS _3d_folder",
        "SP.solidworks_folder AS solidworks_folder",
        "SP.insert_date AS insert_date",
        "SP.update_date AS update_date",
        "SP.remark AS remark",
        "SP.assign_material AS assign_material",
        "SP.assign_weight AS assign_weight",
        "SP.vendor AS vendor",
        "SP.section AS section",
      ])
      .where("SP.status = 1")
      .andWhere(`SP.user_id = ${id}`)
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getSPByUserID", {
          message: "API Done",
          total: data.length,
          value: id,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getSPByUserID", {
          message: "API Error: " + e,
          value: id,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getSPByUserID", {
      message: "API Failed: " + e,
      value: id,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

StandardPartRouter.get("/getAllDeletedSP", async (_req, res) => {
  try {
    await SPManager.createQueryBuilder(StandardParts, "SP")
      .innerJoinAndSelect("SP.user", "U")
      .innerJoinAndSelect("SP.SPCategory", "C")
      .select(["SP.id AS id"])
      .addSelect(["U.fullname AS fullname"])
      .addSelect([
        "C.description AS category_desc",
        "C.category_type AS category_type",
      ])
      .addSelect([
        "SP.erp_code AS erp_code",
        "SP.type_item AS type_item",
        "SP.product_part_number AS product_part_number",
        "SP.greatech_drawing_naming AS greatech_drawing_naming",
        "SP.description AS description",
        "SP.brand AS brand",
        "SP.uom AS uom",
        "SP.folder_location AS folder_location",
        "SP._2d_folder AS _2d_folder",
        "SP._3d_folder AS _3d_folder",
        "SP.solidworks_folder AS solidworks_folder",
        "SP.insert_date AS insert_date",
        "SP.update_date AS update_date",
        "SP.remark AS remark",
        "SP.assign_material AS assign_material",
        "SP.assign_weight AS assign_weight",
        "SP.vendor AS vendor",
        "SP.section AS section",
      ])
      .where("SP.status = 0")
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllDeletedSP", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllDeletedSP", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllDeletedSP", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

StandardPartRouter.post("/getOneSP", async (req, res) => {
  const { id } = req.body;
  try {
    await SPManager.createQueryBuilder(StandardParts, "SP")
      .innerJoinAndSelect("SP.user", "U")
      .innerJoinAndSelect("SP.SPCategory", "C")
      .select(["SP.id AS id"])
      .addSelect(["U.fullname AS fullname"])
      .addSelect([
        "C.description AS category_desc",
        "C.category_type AS category_type",
      ])
      .addSelect([
        "SP.erp_code AS erp_code",
        "SP.type_item AS type_item",
        "SP.product_part_number AS product_part_number",
        "SP.greatech_drawing_naming AS greatech_drawing_naming",
        "SP.description AS description",
        "SP.brand AS brand",
        "SP.uom AS uom",
        "SP.folder_location AS folder_location",
        "SP._2d_folder AS _2d_folder",
        "SP._3d_folder AS _3d_folder",
        "SP.solidworks_folder AS solidworks_folder",
        "SP.insert_date AS insert_date",
        "SP.update_date AS update_date",
        "SP.remark AS remark",
        "SP.assign_material AS assign_material",
        "SP.assign_weight AS assign_weight",
        "SP.vendor AS vendor",
        "SP.section AS section",
      ])
      .where("SP.status = 1")
      .andWhere(`SP.id = ${id}`)
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getOneSP", {
          message: "API Done",
          total: data.length,
          value: id,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getOneSP", {
          message: "API Error: " + e,
          value: id,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getOneSP", {
      message: "API Failed: " + e,
      value: id,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

// ADD DATA ONLY
StandardPartRouter.post("/addSP", async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    var finalERP: any;

    const currentDatetime = moment().format();
    const part_id = data.category.id;
    const section = data.section;
    const vendor = data.vendor;
    const ppn = data.product_part_number;
    const u_id = data.user_id;

    const code = await SPManager.findOne(SP_Category, { id: part_id });
    const initial = code?.code;

    if (initial === undefined) {
      logger.error_obj("API: " + "/addSP", {
        message: "API Error: " + `Unable to find code ${part_id}.`,
        status: false,
      });
      return res.send({
        message: `Unable to find code ${part_id}.`,
        status: false,
      });
    }

    const lastData = await SPManager.findOne(StandardParts, {
      where: { part_id },
      order: { id: "DESC" },
    });

    let getNumber: string = "0";
    if (section == "M") {
      if (lastData === undefined) {
        getNumber = (parseInt("00000000") + 1).toString().padStart(8, "0");
      } else {
        if (initial == "M0J") {
          if (vendor == "LV") {
            const vendorLVData = await SPManager.query(
              `SELECT * FROM standard_parts WHERE erp_code LIKE '%M0J%' AND CONVERT(RIGHT(erp_code, 8), SIGNED) 
                            BETWEEN 1 AND 09999 ORDER BY RIGHT(erp_code, 8) DESC LIMIT 1`
            );
            const [_letterHalf, numberHalf] =
              vendorLVData[0].erp_code.split("-");
            getNumber = (parseInt(numberHalf) + 1).toString().padStart(8, "0");
          } else if (vendor == "AV") {
            const vendorAVData = await SPManager.query(
              `SELECT * FROM standard_parts WHERE erp_code LIKE '%M0J%' AND 
                            CONVERT(RIGHT(erp_code, 8), SIGNED) ORDER BY RIGHT(erp_code, 8) DESC LIMIT 1`
            );
            const [_letterHalf, numberHalf] =
              vendorAVData[0].erp_code.split("-");
            getNumber = (parseInt(numberHalf) + 1).toString().padStart(8, "0");
          } else {
            logger.error_obj("API: " + "/addSP", {
              message:
                "API Error: " +
                `Invalid Vendor Code [${vendor}]. Unable to find it.`,
              status: false,
            });
            return res.send({
              message: `Invalid Vendor Code [${vendor}]. Unable to find it.`,
              status: false,
            });
          }
        } else {
          const [_letterHalf, numberHalf] = lastData.erp_code.split("-");
          getNumber = (parseInt(numberHalf) + 1).toString().padStart(8, "0");
        }
      }
      finalERP = initial + "-" + getNumber;
    }

    if (section == "S" || section == "V" || section == "E") {
      if (lastData === undefined) {
        getNumber = (parseInt("000000") + 1).toString().padStart(6, "0");
      } else {
        const [_letterHalf, numberHalf] = lastData.erp_code.split("-");
        getNumber = (parseInt(numberHalf) + 1).toString().padStart(6, "0");
      }
      finalERP = initial + "-" + getNumber;
    }

    const mainResult = {
      user_id: data.user_id,
      part_id: part_id,
      erp_code: finalERP,
      type_item: data.type_item,
      product_part_number: data.product_part_number,
      greatech_drawing_naming: data.greatech_drawing_naming,
      description: data.description,
      brand: data.brand,
      uom: data.uom,
      folder_location: data.folder_location,
      _2d_folder: data._2d_folder,
      _3d_folder: data._3d_folder,
      solidworks_folder: data.solidworks_folder,
      insert_date: currentDatetime,
      update_date: "",
      remark: data.remark,
      assign_material: data.assign_material,
      assign_weight: data.assign_weight,
      vendor: data.vendor,
      status: 1,
      section: section,
    };

    const checkRedundantPending = await SPManager.findOne(PendingParts, {
      where: {
        product_part_number: data.product_part_number,
        brand: data.brand,
      },
    });

    const checkRedundantStdParts = await SPManager.findOne(StandardParts, {
      where: {
        product_part_number: data.product_part_number,
        brand: data.brand,
      },
    });
    console.log(checkRedundantPending, checkRedundantStdParts);
    if (
      checkRedundantPending !== undefined ||
      checkRedundantStdParts !== undefined
    ) {
      logger.error_obj("API: " + "/addSP", {
        message:
          "API Error: " +
          `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
        status: false,
      });
      return res.send({
        message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
        status: false,
      });
    }

    await SPManager.insert(StandardParts, mainResult)
      .then((data) => {
        logger.info_obj("API: " + "/addSP", {
          message: "API Done",
          main: { erp_code: finalERP, part_number: ppn },
          status: true,
        });
        updateActivityLog(
          currentDatetime,
          finalERP,
          u_id,
          "/addSP",
          "CREATE",
          "Created New Standard Parts"
        );
        res.send({
          data: `Insert Successfully`,
          main: { erp_code: finalERP, part_number: ppn },
          status: true,
        });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/addSP", {
          message: "API Error" + e,
          value: data,
          status: false,
        });
        res.send({ data: `Error On Insert To DB: ` + e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/addSP", {
      message: "API Failed: " + e,
      value: data,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

// ONLY FOR M0P - Customize Standard Parts
StandardPartRouter.post("/addSPMS", async (req, res) => {
  const { data } = req.body;
  try {
    const currentDatetime = moment().format();
    const part_desc = data.sp_category;
    const subs = data.subs;
    const ppn = data.product_part_number;
    const u_id = data.user_id;

    const code = await SPManager.findOne(SP_Category, { id: part_desc });
    const initial = code?.code;
    const part_id = code?.id;

    const lastData = await SPManager.findOne(StandardParts, {
      where: { part_id },
      order: { id: "DESC" },
    });

    const [_letterHalf, numberHalf] = lastData!.erp_code.split("-");
    const newNumberHalf = (parseInt(numberHalf) + 1)
      .toString()
      .padStart(8, "0");
    const finalERP = initial + "-" + newNumberHalf;

    const mainResult = {
      user_id: data.user_id,
      part_id: part_id,
      erp_code: finalERP,
      type_item: data.type_item,
      product_part_number: data.product_part_number,
      greatech_drawing_naming: data.greatech_drawing_naming,
      description: data.description,
      brand: data.brand,
      uom: data.uom,
      folder_location: data.folder_location,
      _2d_folder: data._2d_folder,
      _3d_folder: data._3d_folder,
      solidworks_folder: data.solidworks_folder,
      insert_date: currentDatetime,
      update_date: "",
      remark: data.remark,
      assign_material: data.assign_material,
      assign_weight: data.assign_weight,
      vendor: data.vendor,
      status: 1,
      section: data.section,
    };

    const checkRedundantPending = await SPManager.findOne(PendingParts, {
      where: {
        product_part_number: data.product_part_number,
        brand: data.brand,
      },
    });

    const checkRedundantStdParts = await SPManager.findOne(StandardParts, {
      where: {
        product_part_number: data.product_part_number,
        brand: data.brand,
      },
    });

    if (
      checkRedundantPending !== undefined ||
      checkRedundantStdParts !== undefined
    ) {
      logger.error_obj("API: " + "/addSPMS", {
        message:
          "API Error: " +
          `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
        status: false,
      });
      return res.send({
        message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
        status: false,
      });
    }

    var all_sub = [];
    var erp_part: any[] = [];

    for (let [index, element] of subs.entries()) {
      index++;
      const newNumberHalf = (parseInt("00") + index)
        .toString()
        .padStart(2, "0");
      const result = [finalERP, newNumberHalf].join(".");

      var get_value = {
        erp_code: result,
        part_number: element.product_part_number,
      };

      var sub_temp = {
        erp_code: result,
        product_part_number: element.product_part_number,
        user_id: data.user_id,
        part_id: part_id,
        greatech_drawing_naming: element.greatech_drawing_naming,
        brand: element.brand,
        description: element.description,
        type_item: element.type_item,
        uom: element.uom,
        insert_date: currentDatetime,
        update_date: "",
        remark: element.remark,
        folder_location: data.folder_location,
        _2d_folder: data._2d_folder,
        _3d_folder: data._3d_folder,
        solidworks_folder: data.solidworks_folder,
        assign_material: element.assign_material,
        assign_weight: element.assign_weight,
        vendor: "",
        status: 1,
        section: data.section,
      };

      const subCheckRedundantPending = await SPManager.findOne(PendingParts, {
        where: {
          product_part_number: element.product_part_number,
          brand: element.brand,
        },
      });
      const subCheckRedundantStdParts = await SPManager.findOne(StandardParts, {
        where: {
          product_part_number: element.product_part_number,
          brand: element.brand,
        },
      });

      if (
        subCheckRedundantPending !== undefined ||
        subCheckRedundantStdParts !== undefined
      ) {
        logger.error_obj("API: " + "/addSPMS", {
          message:
            "API Error: " +
            `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
          status: false,
        });
        return res.send({
          message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
          status: false,
        });
      }

      all_sub.push(sub_temp);
      erp_part.push(get_value);
    }

    await SPManager.insert(StandardParts, mainResult);
    await SPManager.insert(StandardParts, all_sub)
      .then((data) => {
        logger.info_obj("API: " + "/addSPMS", {
          message: "API Done",
          main: { erp_code: finalERP, part_number: ppn },
          status: true,
        });
        updateActivityLog(
          currentDatetime,
          finalERP,
          u_id,
          "/addSPMS",
          "CREATE",
          "Created New MS Standard Parts"
        );
        res.send({
          data: `Insert Successfully`,
          main: { erp_code: finalERP, part_number: ppn },
          status: true,
        });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/addSPMS", {
          message: "API Error" + e,
          value: data,
          status: false,
        });
        res.send({ data: `Error On Insert To DB: ` + e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/addSPMS", {
      message: "API Failed: " + e,
      value: data,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

// EDIT DATA ONLY
StandardPartRouter.post("/editSP", async (req, res) => {
  const { data } = req.body;
  try {
    const currentDatetime = moment().format();
    const {
      id,
      product_part_number,
      user_id,
      part_id,
      greatech_drawing_naming,
      brand,
      description,
      type_item,
      uom,
      remark,
      folder_location,
      _2d_folder,
      _3d_folder,
      solidworks_folder,
      assign_material,
      assign_weight,
      vendor,
      section,
    } = data;

    const subCheckRedundantPending = await SPManager.findOne(PendingParts, {
      where: {
        product_part_number: data.product_part_number,
        brand: data.brand,
      },
    });
    const subCheckRedundantStdParts = await SPManager.findOne(StandardParts, {
      where: {
        product_part_number: data.product_part_number,
        brand: data.brand,
      },
    });

    if (
      subCheckRedundantPending !== undefined ||
      subCheckRedundantStdParts !== undefined
    ) {
      logger.error_obj("API: " + "/editSP", {
        message:
          "API Error: " +
          `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
        status: false,
      });
      return res.send({
        message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
        status: false,
      });
    }

    const fetchId = await SPManager.findOne(StandardParts, {
      where: { id: data.id },
    });

    const f_part_id = fetchId?.part_id;
    const f_user_id = fetchId?.user_id;
    const f_erp_code = fetchId?.erp_code;
    const f_vendor = fetchId?.vendor;
    const f_code = f_erp_code!.split("-")[0];

    if (part_id == f_part_id) {
      if (f_code == "M0J") {
        if (f_vendor == vendor) {
          await SPManager.update(
            StandardParts,
            { id },
            {
              user_id,
              product_part_number,
              greatech_drawing_naming,
              brand,
              description,
              type_item,
              uom,
              update_date: currentDatetime,
              remark,
              folder_location,
              _2d_folder,
              _3d_folder,
              solidworks_folder,
              assign_material,
              assign_weight,
              vendor,
              status: 1,
              section: "M",
            }
          )
            .then((data) => {
              logger.info_obj("API: " + "/editSP", {
                message: "API Done",
                main: data,
                status: true,
              });
              updateActivityLog(
                currentDatetime,
                f_erp_code,
                user_id,
                "/editSP",
                "EDIT",
                "Edit Standard Parts"
              );
              res.send({
                data: `Insert Successfully`,
                main: data,
                status: true,
              });
            })
            .catch((e) => {
              logger.error_obj("API: " + "/editSP", {
                message: "API Error" + e,
                value: data,
                status: false,
              });
              res.send({ data: `Error On Editing On DB: ` + e, status: false });
            });
        } else {
          await SPManager.update(
            StandardParts,
            { id },
            {
              user_id,
              type_item: "",
              product_part_number: "",
              greatech_drawing_naming: "",
              description: "",
              brand: "",
              uom: "",
              folder_location: "",
              _2d_folder: "",
              _3d_folder: "",
              solidworks_folder: "",
              update_date: currentDatetime,
              remark: "",
              assign_material: "",
              assign_weight: "",
              vendor: "",
              status: 0,
            }
          ).catch((e) => {
            logger.error_obj("API: " + "/editSP", {
              message: "API Error" + e,
              value: data,
              status: false,
            });
            res.send({
              data: `Error On Remove Old Part Data On DB: ` + e,
              status: false,
            });
          });

          if (vendor == "LV") {
            const vendorLVData = await SPManager.query(
              `SELECT * FROM standard_parts WHERE erp_code LIKE '%M0J%' AND CONVERT(RIGHT(erp_code, 8), SIGNED) 
                            BETWEEN 1 AND 09999 ORDER BY RIGHT(erp_code, 8) DESC LIMIT 1`
            );

            const [_letterHalf, numberHalf] =
              vendorLVData[0].erp_code.split("-");
            const getNumber = (parseInt(numberHalf) + 1)
              .toString()
              .padStart(8, "0");
            const finalERP = f_code + "-" + getNumber;

            const mainResult = {
              user_id: user_id,
              part_id: part_id,
              erp_code: finalERP,
              type_item: type_item,
              product_part_number: product_part_number,
              greatech_drawing_naming: greatech_drawing_naming,
              description: description,
              brand: brand,
              uom: uom,
              folder_location: folder_location,
              _2d_folder: _2d_folder,
              _3d_folder: _3d_folder,
              solidworks_folder: solidworks_folder,
              insert_date: currentDatetime,
              update_date: "",
              remark: remark,
              assign_material: assign_material,
              assign_weight: assign_weight,
              vendor: "LV",
              status: 1,
              section: "M",
            };

            const subCheckRedundantPending = await SPManager.findOne(
              PendingParts,
              {
                where: {
                  product_part_number: data.product_part_number,
                  brand: data.brand,
                },
              }
            );
            const subCheckRedundantStdParts = await SPManager.findOne(
              StandardParts,
              {
                where: {
                  product_part_number: data.product_part_number,
                  brand: data.brand,
                },
              }
            );

            if (
              subCheckRedundantPending !== undefined ||
              subCheckRedundantStdParts !== undefined
            ) {
              logger.error_obj("API: " + "/editSP", {
                message:
                  "API Error: " +
                  `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
                status: false,
              });
              return res.send({
                message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
                status: false,
              });
            }

            await SPManager.insert(StandardParts, mainResult)
              .then((data) => {
                logger.info_obj("API: " + "/editSP", {
                  message: "API Done",
                  main: {
                    erp_code: finalERP,
                    part_number: product_part_number,
                  },
                  status: true,
                });
                updateActivityLog(
                  currentDatetime,
                  finalERP,
                  user_id,
                  "/editSP",
                  "EDIT",
                  "Edit Standard Parts To M0J (LV)"
                );
                res.send({
                  data: `Insert Successfully`,
                  main: {
                    erp_code: finalERP,
                    part_number: product_part_number,
                  },
                  status: true,
                });
              })
              .catch((e) => {
                logger.error_obj("API: " + "/editSP", {
                  message: "API Error" + e,
                  value: data,
                  status: false,
                });
                res.send({
                  data: `Error On Insert To DB: ` + e,
                  status: false,
                });
              });
          }
          if (vendor == "AV") {
            const vendorAVData = await SPManager.query(
              `SELECT * FROM standard_parts WHERE erp_code LIKE '%M0J%' AND 
                            CONVERT(RIGHT(erp_code, 8), SIGNED) ORDER BY RIGHT(erp_code, 8) DESC LIMIT 1`
            );

            const [_letterHalf, numberHalf] =
              vendorAVData[0].erp_code.split("-");
            const getNumber = (parseInt(numberHalf) + 1)
              .toString()
              .padStart(8, "0");
            const finalERP = f_code + "-" + getNumber;

            const mainResult = {
              user_id: user_id,
              part_id: part_id,
              erp_code: finalERP,
              type_item: type_item,
              product_part_number: product_part_number,
              greatech_drawing_naming: greatech_drawing_naming,
              description: description,
              brand: brand,
              uom: uom,
              folder_location: folder_location,
              _2d_folder: _2d_folder,
              _3d_folder: _3d_folder,
              solidworks_folder: solidworks_folder,
              insert_date: currentDatetime,
              update_date: "",
              remark: remark,
              assign_material: assign_material,
              assign_weight: assign_weight,
              vendor: "AV",
              status: 1,
              section: "M",
            };

            const subCheckRedundantPending = await SPManager.findOne(
              PendingParts,
              {
                where: {
                  product_part_number: data.product_part_number,
                  brand: data.brand,
                },
              }
            );
            const subCheckRedundantStdParts = await SPManager.findOne(
              StandardParts,
              {
                where: {
                  product_part_number: data.product_part_number,
                  brand: data.brand,
                },
              }
            );

            if (
              subCheckRedundantPending !== undefined ||
              subCheckRedundantStdParts !== undefined
            ) {
              logger.error_obj("API: " + "/editSP", {
                message:
                  "API Error: " +
                  `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
                status: false,
              });
              return res.send({
                message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
                status: false,
              });
            }

            await SPManager.insert(StandardParts, mainResult)
              .then((data) => {
                logger.info_obj("API: " + "/editSP", {
                  message: "API Done",
                  main: {
                    erp_code: finalERP,
                    part_number: product_part_number,
                  },
                  status: true,
                });
                updateActivityLog(
                  currentDatetime,
                  finalERP,
                  user_id,
                  "/editSP",
                  "EDIT",
                  "Edit Standard Parts To M0J (AV)"
                );
                res.send({
                  data: `Insert Successfully`,
                  main: {
                    erp_code: finalERP,
                    part_number: product_part_number,
                  },
                  status: true,
                });
              })
              .catch((e) => {
                logger.error_obj("API: " + "/editSP", {
                  message: "API Error" + e,
                  value: data,
                  status: false,
                });
                res.send({
                  data: `Error On Insert To DB: ` + e,
                  status: false,
                });
              });
          }
        }
      } else if (f_code == "M0P") {
        await SPManager.update(
          StandardParts,
          { id },
          {
            user_id,
            product_part_number,
            greatech_drawing_naming,
            brand,
            description,
            type_item,
            uom,
            remark,
            update_date: currentDatetime,
            folder_location,
            _2d_folder,
            _3d_folder,
            solidworks_folder,
            assign_material,
            assign_weight,
            vendor,
            status: 1,
            section: "M",
          }
        ).catch((e) => {
          logger.error_obj("API: " + "/editSP", {
            message: "API Error" + e,
            value: data,
            status: false,
          });
          res.send({ data: `Error On Edit Main To DB: ` + e, status: false });
        });

        const checkRedundantPending = await SPManager.findOne(PendingParts, {
          where: {
            product_part_number: data.product_part_number,
            brand: data.brand,
          },
        });
        const checkRedundantStdParts = await SPManager.findOne(StandardParts, {
          where: {
            product_part_number: data.product_part_number,
            brand: data.brand,
          },
        });

        if (
          checkRedundantPending !== undefined ||
          checkRedundantStdParts !== undefined
        ) {
          logger.error_obj("API: " + "/editSP", {
            message:
              "API Error: " +
              `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
            status: false,
          });
          return res.send({
            message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
            status: false,
          });
        }

        const getAllChild = await SPManager.createQueryBuilder()
          .select()
          .from(StandardParts, "SP")
          .where("SP.erp_code LIKE :erp", { erp: "%" + f_erp_code + "%" })
          .getMany();

        for (let [_index, element] of getAllChild.entries()) {
          await SPManager.update(
            StandardParts,
            { erp_code: element.erp_code },
            {
              folder_location,
              update_date: currentDatetime,
              user_id,
            }
          ).catch((e) => {
            logger.error_obj("API: " + "/editSP", {
              message: "API Error" + e,
              value: data,
              status: false,
            });
            res.send({ data: `Error On Edit Sub To DB: ` + e, status: false });
          });
        }

        logger.info_obj("API: " + "/editSP", {
          message: "API Done",
          main: { erp_code: f_erp_code, part_number: product_part_number },
          status: true,
        });
        updateActivityLog(
          currentDatetime,
          f_erp_code,
          user_id,
          "/editSP",
          "EDIT",
          "Edit Standard Parts To M0P"
        );
        res.send({
          data: `Insert Successfully`,
          main: { erp_code: f_erp_code, part_number: product_part_number },
          status: true,
        });
      } else {
        await SPManager.update(
          StandardParts,
          { id },
          {
            user_id,
            product_part_number,
            greatech_drawing_naming,
            brand,
            description,
            type_item,
            uom,
            remark,
            update_date: currentDatetime,
            folder_location,
            _2d_folder,
            _3d_folder,
            solidworks_folder,
            assign_material,
            assign_weight,
            vendor,
            status: 1,
            section,
          }
        )
          .then((data) => {
            logger.info_obj("API: " + "/editSP", {
              message: "API Done",
              main: data,
              status: true,
            });
            updateActivityLog(
              currentDatetime,
              f_erp_code,
              user_id,
              "/editSP",
              "EDIT",
              "Edit Standard Parts"
            );
            res.send({ data: `Insert Successfully`, main: data, status: true });
          })
          .catch((e) => {
            logger.error_obj("API: " + "/editSP", {
              message: "API Error" + e,
              value: data,
              status: false,
            });
            res.send({ data: `Error On Editing On DB: ` + e, status: false });
          });
      }
    } else {
      const code = await SP_Category.findOne({ where: { id: part_id } });
      const initial = code?.code;
      const lastData = await SPManager.findOne(StandardParts, {
        where: { part_id },
        order: { id: "DESC" },
      });

      let getNumber: string = "0";

      await SPManager.update(
        StandardParts,
        { id },
        {
          user_id,
          type_item: "",
          product_part_number: "",
          greatech_drawing_naming: "",
          description: "",
          brand: "",
          uom: "",
          folder_location: "",
          _2d_folder: "",
          _3d_folder: "",
          solidworks_folder: "",
          update_date: currentDatetime,
          remark: "",
          assign_material: "",
          assign_weight: "",
          vendor: "",
          status: 0,
        }
      ).catch((e) => {
        logger.error_obj("API: " + "/editSP", {
          message: "API Error" + e,
          value: data,
          status: false,
        });
        res.send({
          data: `Error On Remove Old Part Data On DB: ` + e,
          status: false,
        });
      });
      if (f_code == "M0J" && section == "M") {
        if (vendor == "LV") {
          const vendorLVData = await SPManager.query(
            `SELECT * FROM standard_parts WHERE erp_code LIKE '%M0J%' AND CONVERT(RIGHT(erp_code, 8), SIGNED) 
                        BETWEEN 1 AND 09999 ORDER BY RIGHT(erp_code, 8) DESC LIMIT 1`
          );

          const [_letterHalf, numberHalf] = vendorLVData[0].erp_code.split("-");
          const getNumber = (parseInt(numberHalf) + 1)
            .toString()
            .padStart(8, "0");
          const finalERP = f_code + "-" + getNumber;

          const mainResult = {
            user_id: user_id,
            part_id: part_id,
            erp_code: finalERP,
            type_item: type_item,
            product_part_number: product_part_number,
            greatech_drawing_naming: greatech_drawing_naming,
            description: description,
            brand: brand,
            uom: uom,
            folder_location: folder_location,
            _2d_folder: _2d_folder,
            _3d_folder: _3d_folder,
            solidworks_folder: solidworks_folder,
            insert_date: currentDatetime,
            update_date: "",
            remark: remark,
            assign_material: assign_material,
            assign_weight: assign_weight,
            vendor: "LV",
            status: 1,
            section: "M",
          };

          const checkRedundantPending = await SPManager.findOne(PendingParts, {
            where: {
              product_part_number: data.product_part_number,
              brand: data.brand,
            },
          });
          const checkRedundantStdParts = await SPManager.findOne(
            StandardParts,
            {
              where: {
                product_part_number: data.product_part_number,
                brand: data.brand,
              },
            }
          );

          if (
            checkRedundantPending !== undefined ||
            checkRedundantStdParts !== undefined
          ) {
            logger.error_obj("API: " + "/editSP", {
              message:
                "API Error: " +
                `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
              status: false,
            });
            return res.send({
              message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
              status: false,
            });
          }

          await SPManager.insert(StandardParts, mainResult)
            .then((data) => {
              logger.info_obj("API: " + "/editSP", {
                message: "API Done",
                main: { erp_code: finalERP, part_number: product_part_number },
                status: true,
              });
              updateActivityLog(
                currentDatetime,
                finalERP,
                user_id,
                "/editSP",
                "EDIT",
                "Edit Standard Parts To M0J (LV)"
              );
              res.send({
                data: `Insert Successfully`,
                main: { erp_code: finalERP, part_number: product_part_number },
                status: true,
              });
            })
            .catch((e) => {
              logger.error_obj("API: " + "/editSP", {
                message: "API Error" + e,
                value: data,
                status: false,
              });
              res.send({ data: `Error On Insert To DB: ` + e, status: false });
            });
        }
        if (vendor == "AV") {
          const vendorAVData = await SPManager.query(
            `SELECT * FROM standard_parts WHERE erp_code LIKE '%M0J%' AND 
                        CONVERT(RIGHT(erp_code, 8), SIGNED) ORDER BY RIGHT(erp_code, 8) DESC LIMIT 1`
          );

          const [_letterHalf, numberHalf] = vendorAVData[0].erp_code.split("-");
          const getNumber = (parseInt(numberHalf) + 1)
            .toString()
            .padStart(8, "0");
          const finalERP = f_code + "-" + getNumber;

          const mainResult = {
            user_id: user_id,
            part_id: part_id,
            erp_code: finalERP,
            type_item: type_item,
            product_part_number: product_part_number,
            greatech_drawing_naming: greatech_drawing_naming,
            description: description,
            brand: brand,
            uom: uom,
            folder_location: folder_location,
            _2d_folder: _2d_folder,
            _3d_folder: _3d_folder,
            solidworks_folder: solidworks_folder,
            insert_date: currentDatetime,
            update_date: "",
            remark: remark,
            assign_material: assign_material,
            assign_weight: assign_weight,
            vendor: "AV",
            status: 1,
            section: "M",
          };

          const checkRedundantPending = await SPManager.findOne(PendingParts, {
            where: {
              product_part_number: data.product_part_number,
              brand: data.brand,
            },
          });
          const checkRedundantStdParts = await SPManager.findOne(
            StandardParts,
            {
              where: {
                product_part_number: data.product_part_number,
                brand: data.brand,
              },
            }
          );

          if (
            checkRedundantPending !== undefined ||
            checkRedundantStdParts !== undefined
          ) {
            logger.error_obj("API: " + "/editSP", {
              message:
                "API Error: " +
                `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
              status: false,
            });
            return res.send({
              message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
              status: false,
            });
          }

          await SPManager.insert(StandardParts, mainResult)
            .then((data) => {
              logger.info_obj("API: " + "/editSP", {
                message: "API Done",
                main: { erp_code: finalERP, part_number: product_part_number },
                status: true,
              });
              updateActivityLog(
                currentDatetime,
                finalERP,
                user_id,
                "/editSP",
                "EDIT",
                "Edit Standard Parts To M0J (AV)"
              );
              res.send({
                data: `Insert Successfully`,
                main: { erp_code: finalERP, part_number: product_part_number },
                status: true,
              });
            })
            .catch((e) => {
              logger.error_obj("API: " + "/editSP", {
                message: "API Error" + e,
                value: data,
                status: false,
              });
              res.send({ data: `Error On Insert To DB: ` + e, status: false });
            });
        }
      } else if (f_code != "M0J" && section == "M") {
        if (lastData === undefined) {
          getNumber = (parseInt("00000000") + 1).toString().padStart(8, "0");
        }

        const [_letterHalf, numberHalf] = lastData!.erp_code.split("-");
        getNumber = (parseInt(numberHalf) + 1).toString().padStart(8, "0");
        const finalERP = initial + "-" + getNumber;

        const mainResult = {
          user_id: user_id,
          part_id: part_id,
          erp_code: finalERP,
          type_item: type_item,
          product_part_number: product_part_number,
          greatech_drawing_naming: greatech_drawing_naming,
          description: description,
          brand: brand,
          uom: uom,
          folder_location: folder_location,
          _2d_folder: _2d_folder,
          _3d_folder: _3d_folder,
          solidworks_folder: solidworks_folder,
          insert_date: currentDatetime,
          update_date: "",
          remark: remark,
          assign_material: assign_material,
          assign_weight: assign_weight,
          vendor: vendor,
          status: 1,
          section: section,
        };

        const checkRedundantPending = await SPManager.findOne(PendingParts, {
          where: {
            product_part_number: data.product_part_number,
            brand: data.brand,
          },
        });
        const checkRedundantStdParts = await SPManager.findOne(StandardParts, {
          where: {
            product_part_number: data.product_part_number,
            brand: data.brand,
          },
        });

        if (
          checkRedundantPending !== undefined ||
          checkRedundantStdParts !== undefined
        ) {
          logger.error_obj("API: " + "/editSP", {
            message:
              "API Error: " +
              `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
            status: false,
          });
          return res.send({
            message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
            status: false,
          });
        }

        await SPManager.insert(StandardParts, mainResult)
          .then((data) => {
            logger.info_obj("API: " + "/editSP", {
              message: "API Done",
              main: { erp_code: finalERP, part_number: product_part_number },
              status: true,
            });
            updateActivityLog(
              currentDatetime,
              finalERP,
              user_id,
              "/editSP",
              "EDIT",
              "Edit Standard Parts To M"
            );
            res.send({
              data: `Insert Successfully`,
              main: { erp_code: finalERP, part_number: product_part_number },
              status: true,
            });
          })
          .catch((e) => {
            logger.error_obj("API: " + "/editSP", {
              message: "API Error" + e,
              value: data,
              status: false,
            });
            res.send({ data: `Error On Insert To DB: ` + e, status: false });
          });
      } else if (section == "V" || section == "S" || section == "E") {
        if (lastData === undefined) {
          getNumber = (parseInt("000000") + 1).toString().padStart(6, "0");
        }

        const [_letterHalf, numberHalf] = lastData!.erp_code.split("-");
        getNumber = (parseInt(numberHalf) + 1).toString().padStart(6, "0");
        const finalERP = initial + "-" + getNumber;

        const mainResult = {
          user_id: user_id,
          part_id: part_id,
          erp_code: finalERP,
          type_item: type_item,
          product_part_number: product_part_number,
          greatech_drawing_naming: greatech_drawing_naming,
          description: description,
          brand: brand,
          uom: uom,
          folder_location: folder_location,
          _2d_folder: _2d_folder,
          _3d_folder: _3d_folder,
          solidworks_folder: solidworks_folder,
          insert_date: currentDatetime,
          update_date: "",
          remark: remark,
          assign_material: assign_material,
          assign_weight: assign_weight,
          vendor: vendor,
          status: 1,
          section: section,
        };

        const checkRedundantPending = await SPManager.findOne(PendingParts, {
          where: {
            product_part_number: data.product_part_number,
            brand: data.brand,
          },
        });
        const checkRedundantStdParts = await SPManager.findOne(StandardParts, {
          where: {
            product_part_number: data.product_part_number,
            brand: data.brand,
          },
        });

        if (
          checkRedundantPending !== undefined ||
          checkRedundantStdParts !== undefined
        ) {
          logger.error_obj("API: " + "/editSP", {
            message:
              "API Error: " +
              `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}.`,
            status: false,
          });
          return res.send({
            message: `Redundant on ProductPartNumber ${data.product_part_number} and Brand ${data.brand}`,
            status: false,
          });
        }

        await SPManager.insert(StandardParts, mainResult)
          .then((data) => {
            logger.info_obj("API: " + "/editSP", {
              message: "API Done",
              main: { erp_code: finalERP, part_number: product_part_number },
              status: true,
            });
            updateActivityLog(
              currentDatetime,
              finalERP,
              user_id,
              "/editSP",
              "EDIT",
              "Edit Standard Parts To S/E/V"
            );
            res.send({
              data: `Insert Successfully`,
              main: { erp_code: finalERP, part_number: product_part_number },
              status: true,
            });
          })
          .catch((e) => {
            logger.error_obj("API: " + "/editSP", {
              message: "API Error" + e,
              value: data,
              status: false,
            });
            res.send({ data: `Error On Insert To DB: ` + e, status: false });
          });
      }
    }
  } catch (e) {
    logger.error_obj("API: " + "/editSP", {
      message: "API Failed: " + e,
      value: data,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

// DELETE DATA ONLY
StandardPartRouter.post("/deleteSP", async (req, res) => {
  const { id, user_id } = req.body;

  var stdPart: any;

  try {
    const currentDatetime = moment().format();
    stdPart = await SPManager.findOne(StandardParts, { where: { id } });

    await SPManager.update(
      StandardParts,
      { id },
      {
        update_date: currentDatetime,
        status: 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/deleteSP", {
          message: "API Done",
          value: stdPart,
          status: true,
        });
        updateActivityLog(
          currentDatetime,
          stdPart?.erp_code,
          user_id,
          "/deleteSP",
          "DELETE",
          "Delete Standard Parts"
        );
        res.send({ data: "Deleted Successfully", status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/deleteSP", {
          message: "API Error: " + e,
          value: stdPart,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/deleteSP", {
      message: "API Failed: " + e,
      value: stdPart,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

StandardPartRouter.post("/recoverSP", async (req, res) => {
  const { id, user_id } = req.body;

  var stdPart: any;

  try {
    const currentDatetime = moment().format();
    stdPart = await SPManager.findOne(StandardParts, { where: { id } });

    await SPManager.update(
      StandardParts,
      { id },
      {
        update_date: currentDatetime,
        status: 1,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/recoverSP", {
          message: "API Done",
          value: stdPart,
          status: true,
        });
        updateActivityLog(
          currentDatetime,
          stdPart?.erp_code,
          user_id,
          "/recoverSP",
          "Recover",
          "Recover Standard Parts"
        );
        res.send({ data: "Deleted Successfully", status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/recoverSP", {
          message: "API Error: " + e,
          value: stdPart,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/recoverSP", {
      message: "API Failed: " + e,
      value: stdPart,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

// CHANGE USER
StandardPartRouter.post("/switchSPUser", async (req, res) => {
  const { old_id, new_id, user_id } = req.body;
  try {
    const currentDatetime = moment().format();
    const checkNewId = await SPManager.findOne(User, { id: new_id });
    const getERPToChange = await SPManager.createQueryBuilder(
      StandardParts,
      "SP"
    )
      .select("SP.erp_code")
      .where(`SP.user_id = ${old_id}`)
      .getRawMany();

    if (checkNewId === undefined) {
      logger.error_obj("API: " + "/switchSPUser", {
        message: "API Error: " + `Not able to find Employee ID ${new_id}.`,
        value: new_id,
        status: false,
      });
      return res.send({
        message: `Not able to find Employee ID ${new_id}.`,
        status: false,
      });
    }

    await SPManager.update(
      StandardParts,
      { user_id: old_id },
      {
        user_id: new_id,
        update_date: currentDatetime,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/switchSPUser", {
          message: "API Done",
          main: data,
          status: true,
        });
        updateActivityLog(
          currentDatetime,
          getERPToChange,
          user_id,
          "/switchSPUser",
          "EDIT",
          "Edit User Standard Parts"
        );
        res.send({ data: `Insert Successfully`, main: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/switchSPUser", {
          message: "API Error: " + e,
          value: new_id,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {}
});

module.exports = StandardPartRouter;
