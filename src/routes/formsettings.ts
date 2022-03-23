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
import { FormSettings } from "../entity/FormSettings";

const logger = new LoggerService("form-settings-api");
const SPFormSettingsRouter = Router();
const FormSettingsManager = getManager("standardPartsDB");

SPFormSettingsRouter.get("/", async (_req, res) => {
  res.send("Connect To Form Settings Successfully.");
});

SPFormSettingsRouter.get("/getAllFormSettings", async (_req, res) => {
  try {
    await FormSettingsManager.createQueryBuilder(FormSettings, "FormSettings")
      .select([
        "FormSettings.id",
        "FormSettings.section",
        "FormSettings.settings",
        "FormSettings.updated_date",
      ])
      .getRawMany()
      .then((data) => {
        logger.info_obj("API: " + "/getAllFormSettings", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getAllFormSettings", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getAllFormSettings", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPFormSettingsRouter.post("/getOneFormSettings", async (req, res) => {
  const { section } = req.body;

  try {
    await FormSettingsManager.createQueryBuilder(FormSettings, "FormSettings")
      .select([
        "FormSettings.id",
        "FormSettings.section",
        "FormSettings.settings",
        "FormSettings.updated_date",
      ])
      .where(`section = ${section}`)
      .getRawOne()
      .then((data) => {
        logger.info_obj("API: " + "/getOneFormSettings", {
          message: "API Done",
          total: data.length,
          status: true,
        });
        res.send({ data, total: data.length, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/getOneFormSettings", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/getOneFormSettings", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

SPFormSettingsRouter.post("/editFormSettings", async (req, res) => {
  const { section, values } = req.body;
  try {
    await FormSettingsManager.update(
      FormSettings,
      { section },
      {
        settings: values,
        updated_date: Date.now(),
      }
    )
      .then((data) => {
        logger.info_obj("API: " + "/editFormSettings", {
          message: "API Done",
          value: data,
          status: true,
        });
        res.send({ data, value: data, status: true });
      })
      .catch((e) => {
        logger.error_obj("API: " + "/editFormSettings", {
          message: "API Error: " + e,
          status: false,
        });
        res.send({ message: e, status: false });
      });
  } catch (e) {
    logger.error_obj("API: " + "/editFormSettings", {
      message: "API Failed: " + e,
      status: false,
    });
    res.send({ message: e, status: false });
  }
});

module.exports = SPFormSettingsRouter;
