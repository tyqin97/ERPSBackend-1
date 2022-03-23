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
import argon2 from "argon2";
import { SP_UomTypes } from "../entity/SP_Uom";

const logger = new LoggerService("type-item-api");
const SPTypeItemRouter = Router();
const TypeItemManager = getManager("standardPartsDB");

SPTypeItemRouter.get("/", async (_req, res) => {
  res.send("Connect To Type Item Successfully.");
});

SPTypeItemRouter.get("/getAllTypeItems", async (_req, res) => {
  try {
    await TypeItemManager.createQueryBuilder(SP_TypeItems, "TypeItems")
      .select(["TypeItems.id", "TypeItems.type_item"])
      .addSelect(
        "CASE WHEN TypeItems.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .innerJoinAndSelect("TypeItems.category", "Category")
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllTypeItems", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllTypeItems", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllTypeItems", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPTypeItemRouter.get("/getAllTypeItem", async (_req, res) => {
  try {
    await TypeItemManager.createQueryBuilder(SP_TypeItems, "TypeItems")
      .select(["TypeItems.id", "TypeItems.type_item"])
      .addSelect(
        "CASE WHEN TypeItems.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("TypeItems.status = 1")
      .innerJoinAndSelect("TypeItems.category", "Category")
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllTypeItem", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllTypeItem", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllTypeItem", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPTypeItemRouter.post("/getTypeItemByCategory", async (req, res) => {
  const { id } = req.body;

  try {
    await TypeItemManager.createQueryBuilder(SP_TypeItems, "TypeItems")
      .select(["TypeItems.id", "TypeItems.type_item"])
      .addSelect(
        "CASE WHEN TypeItems.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where(`TypeItems.status = 1 and Category.id = ${id} `)
      .innerJoinAndSelect("TypeItems.category", "Category")
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getTypeItemByCategory", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getTypeItemByCategory", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getTypeItemByCategory", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPTypeItemRouter.post("/getOneTypeItem", async (req, res) => {
  const { id } = req.body;

  try {
    await TypeItemManager.createQueryBuilder(SP_TypeItems, "TypeItems")
      .select(["TypeItems.id", "TypeItems.type_item"])
      .addSelect(
        "CASE WHEN TypeItems.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where(`TypeItems.id = ${id} `)
      .innerJoinAndSelect("TypeItems.category", "Category")
      .getRawOne()
      .then((data) => {
        logger.info_obj("API: " + "/getOneTypeItem", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getOneTypeItem", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getOneTypeItem", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPTypeItemRouter.post("/addTypeItem", async (req, res) => {
  const { values } = req.body;
  try {
    const checkDuplicate = await TypeItemManager.findOne(SP_TypeItems, {
      category_id: values.category,
      type_item: values.type_item,
    });

    if (checkDuplicate !== undefined) {
      logger.error_obj("API: " + "/addTypeItem", {
        message: "API Error: " + `Redundant on Type Item ${values.type_item}.`,
        value: values,
        status: false,
      });
      return res.send({
        message: `Redundant on Type Item ${values.type_item}.`,
        status: false,
      });
    }

    const mainResult = {
      category_id: values.category,
      type_item: values.type_item,
      status: 1,
    };

    await TypeItemManager.insert(SP_TypeItems, mainResult)
      .then((data) => {
        logger.info_obj("API: " + "/addTypeItem", {
          message: "API Done",
          value: values,
          status: true,
        });
        res.send({ data, value: values, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/addTypeItem", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/addTypeItem", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPTypeItemRouter.post("/editTypeItem", async (req, res) => {
  const { id, values } = req.body;

  try {
    const checkDuplicate = await TypeItemManager.findOne(SP_TypeItems, {
      category_id: values.category,
      type_item: values.type_item,
    });

    if (checkDuplicate !== undefined) {
      if (checkDuplicate?.id != id) {
        logger.error_obj("API: " + "/editTypeItem", {
          message:
            "API Error: " + `Redundant on Type Item ${values.type_item}.`,
          value: values,
          status: false,
        });
        return res.send({
          message: `Redundant on Type Item ${values.type_item}.`,
          status: false,
        });
      }
    }

    await TypeItemManager.update(
      SP_TypeItems,
      { id },
      {
        category_id: values.category,
        type_item: values.type_item,
        status: values.status === "Show" ? 1 : 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/editTypeItem", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/editTypeItem", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/editTypeItem", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPTypeItemRouter.post("/deleteTypeItem", async (req, res) => {
  const { id } = req.body;
  try {
    await TypeItemManager.update(
      SP_TypeItems,
      { id },
      {
        status: 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/deleteTypeItem", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/deleteTypeItem", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/deleteTypeItem", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPTypeItemRouter.post("/recoverTypeItem", async (req, res) => {
  const { id } = req.body;
  try {
    await TypeItemManager.update(
      SP_TypeItems,
      { id },
      {
        status: 1,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/recoverTypeItem", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/recoverTypeItem", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/recoverTypeItem", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

module.exports = SPTypeItemRouter;
