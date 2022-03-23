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

const logger = new LoggerService("uom-api");
const SPUOMRouter = Router();
const UOMManager = getManager("standardPartsDB");

SPUOMRouter.get("/", async (_req, res) => {
  res.send("Connect To UOM Successfully.");
});

SPUOMRouter.get("/getAllUOMs", async (_req, res) => {
  try {
    await UOMManager.createQueryBuilder(SP_UomTypes, "UOM")
      .select(["UOM.id", "UOM.uom_type"])
      .addSelect(
        "CASE WHEN UOM.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllUOM", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllUOM", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllUOM", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPUOMRouter.get("/getAllUOM", async (_req, res) => {
  try {
    await UOMManager.createQueryBuilder(SP_UomTypes, "UOM")
      .select(["UOM.id", "UOM.uom_type", "UOM.status"])
      .addSelect(
        "CASE WHEN UOM.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where("status = 1")
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllUOM", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllUOM", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllUOM", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPUOMRouter.post("/getOneUOM", async (req, res) => {
  const { id } = req.body;

  try {
    await UOMManager.createQueryBuilder(SP_UomTypes, "UOM")
      .select(["UOM.id", "UOM.uom_type", "UOM.status"])
      .addSelect(
        "CASE WHEN UOM.status = 1 then 'Show' else 'Hide' end",
        "status"
      )
      .where(`id = ${id} `)
      .getRawOne()
      .then((data) => {
        logger.info_obj("API: " + "/getOneUOM", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getOneUOM", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getOneUOM", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPUOMRouter.post("/addUOM", async (req, res) => {
  const { values } = req.body;
  try {
    const checkDuplicate = await UOMManager.findOne(SP_UomTypes, {
      uom_type: values.uom,
    });

    if (checkDuplicate !== undefined) {
      logger.error_obj("API: " + "/addUOM", {
        message: "API Error: " + `Redundant on UOM ${values.uom}.`,
        value: values.uom,
        status: false,
      });
      return res.send({
        message: `Redundant on UOM ${values.uom}.`,
        status: false,
      });
    }

    const mainResult = {
      uom_type: values.uom,
      status: 1,
    };

    await UOMManager.insert(SP_UomTypes, mainResult)
      .then((data) => {
        logger.info_obj("API: " + "/addUOM", {
          message: "API Done",
          value: values.uom,
          status: true,
        });
        res.send({ data, value: values.uom, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/addUOM", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/addUOM", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPUOMRouter.post("/editUOM", async (req, res) => {
  const { id, values } = req.body;
  try {
    const checkDuplicate = await UOMManager.findOne(SP_UomTypes, {
      uom_type: values.uom,
    });

    if (checkDuplicate !== undefined) {
      if (checkDuplicate?.id != id) {
        logger.error_obj("API: " + "/editUOM", {
          message: "API Error: " + `Redundant on UOM ${values.uom}.`,
          value: values.uom,
          status: false,
        });
        return res.send({
          message: `Redundant on UOM ${values.uom}.`,
          status: false,
        });
      }
    }

    await UOMManager.update(
      SP_UomTypes,
      { id },
      {
        uom_type: values.uom,
        status: values.status === "Show" ? 1 : 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/editUOM", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/editUOM", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/editUOM", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPUOMRouter.post("/deleteUOM", async (req, res) => {
  const { id } = req.body;
  try {
    await UOMManager.update(
      SP_UomTypes,
      { id },
      {
        status: 0,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/deleteUOM", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/deleteUOM", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/deleteUOM", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPUOMRouter.post("/recoverUOM", async (req, res) => {
  const { id } = req.body;
  try {
    await UOMManager.update(
      SP_UomTypes,
      { id },
      {
        status: 1,
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/recoverUOM", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/recoverUOM", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/recoverUOM", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

module.exports = SPUOMRouter;
