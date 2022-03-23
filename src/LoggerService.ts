const winston = require('winston');

export class LoggerService {
    log_data:any;
    route:any;
    logger:any;
    
    constructor(route:any) {
        this.log_data = null
        this.route = route
        const logger = winston.createLogger({
            transports: [
                new winston.transports.Console({    
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                }),
                new winston.transports.File({
                filename: `./logs/${route}.log`
                })
            ],
            format: winston.format.printf((info:any) => {
                let message = `${this.dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${info.message} | `
                message = info.obj ? message + `data:${JSON.stringify(info.obj)} | ` : message
                message = this.log_data ? message + `log_data:${JSON.stringify(this.log_data)} | ` : message
                return message
            })
        });
        this.logger = logger
    }

    setLogData(log_data:any) {
        this.log_data = log_data
    }

    async info(message:any) {
        await this.logger.log('info', message);
    }
    async info_obj(message:any, obj:any) {
        await this.logger.log('info', message, {
            obj
        });
    }

    async debug(message:any) {
        await this.logger.log('debug', message);
    }
    async debug_obj(message:any, obj:any) {
        await this.logger.log('debug', message, {
            obj
        });
    }

    async error(message:any) {
        await this.logger.log('error', message);
    }
    async error_obj(message:any, obj:any) {
        await this.logger.log('error', message, {
            obj
        });
    }

    dateFormat(){
        return new Date(Date.now()).toString();
    }
}