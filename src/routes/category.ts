import e, { Router } from "express";
import moment from "moment";
import { SP_Category } from "../entity/SP_Category";
import { getConnection, getManager, Like } from "typeorm";
import { StandardParts } from "../entity/SP";

import { LoggerService } from "../LoggerService";
import { PendingParts } from "../entity/SP_Pending";
import { ActivityLog } from "../entity/ActivityLog";
import { User } from "../entity/User";
import argon2 from "argon2";
import { SP_UomTypes } from "../entity/SP_Uom";

const logger = new LoggerService("category-api");
const SPCategoryRouter = Router();
const CategoryManager = getManager("standardPartsDB");

SPCategoryRouter.get("/", async (_req, res) => {
  res.send("Connect To Category Successfully.");
});

SPCategoryRouter.get("/getAllCategorys", async (_req, res) => {
  try {
    await CategoryManager.createQueryBuilder(SP_Category, "Category")
      .select([
        "Category.id",
        "Category.category_type",
        "Category.description",
        "Category.code",
      ])
      .addSelect(
        "CASE WHEN Category.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllCategorys", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllCategorys", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllCategorys", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPCategoryRouter.get("/getAllCategory", async (_req, res) => {
  try {
    await CategoryManager.createQueryBuilder(SP_Category, "Category")
      .select([
        "Category.id",
        "Category.category_type",
        "Category.description",
        "Category.code",
      ])
      .addSelect(
        "CASE WHEN Category.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("status = 1")
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllCategory", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllCategory", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllCategory", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPCategoryRouter.post("/getOneCategory", async (req, res) => {
  const { id } = req.body;

  try {
    await CategoryManager.createQueryBuilder(SP_Category, "Category")
      .select([
        "Category.id",
        "Category.category_type",
        "Category.description",
        "Category.code",
      ])
      .addSelect(
        "CASE WHEN Category.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where(`id = ${id}`)
      .getRawOne()
      .then((data) => {
        logger.info_obj("API: " + "/getOneCategory", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getOneCategory", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getOneCategory", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPCategoryRouter.post("/addCategory", async (req, res) => {
  const { values } = req.body;
  try {
    const checkDuplicate = await CategoryManager.findOne(SP_Category, {
      category_type: values.category_type,
      description: values.description,
      code: values.descriptions,
    });

    if (checkDuplicate !== undefined) {
      logger.error_obj("API: " + "/addCategory", {
        message:
          "API Error: " +
          `Redundant on Category ${values.category_type} - ${values.description} (${values.code}).`,
        value: values.uom,
        status: false,
      });
      return res.send({
        message: `Redundant on Category ${values.category_type} - ${values.description} (${values.code}).`,
        status: false,
      });
    }

    const mainResult = {
      category_type: values.category_type,
      description: values.description,
      code: values.code,
      status: 1,
    };

    await CategoryManager.insert(SP_Category, mainResult)
      .then((data) => {
        logger.info_obj("API: " + "/addCategory", {
          message: "API Done",
          value: values,
          status: true,
        });
        res.send({ data, value: values, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/addCategory", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/addCategory", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPCategoryRouter.post("/editCategory", async (req, res) => {
  const { id, values } = req.body;
  try {
    const checkDuplicate = await CategoryManager.findOne(SP_Category, {
      category_type: values.category_type,
      description: values.description,
      code: values.code,
    });

    if (checkDuplicate !== undefined) {
      if (checkDuplicate?.id != id) {
        logger.error_obj("API: " + "/editCategory", {
          message:
            "API Error: " +
            `Redundant on Category ${values.category_type} - ${values.description} (${values.code}).`,
          value: values,
          status: false,
        });
        return res.send({
          message: `Redundant on Category ${values.category_type} - ${values.description} (${values.code}).`,
          status: false,
        });
      }
    }

    await CategoryManager.update(
      SP_Category,
      { id },
      {
        category_type: values.category_type,
        description: values.description,
        code: values.code,
        status: values.status === "Show" ? 1 : 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/editCategory", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/editCategory", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/editCategory", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPCategoryRouter.post("/deleteCategory", async (req, res) => {
  const { id } = req.body;
  try {
    await CategoryManager.update(
      SP_Category,
      { id },
      {
        status: 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/deleteCategory", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/deleteCategory", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/deleteCategory", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPCategoryRouter.post("/recoverCategory", async (req, res) => {
  const { id } = req.body;
  try {
    await CategoryManager.update(
      SP_Category,
      { id },
      {
        status: 1,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/recoverCategory", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/recoverCategory", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/recoverCategory", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

module.exports = SPCategoryRouter;
