/* Author: Pablo Sagastizabal */

module.exports = (router) => {
    
    const fs = require('fs'),
        log_path = './error.log'

    router.route('/log')
        .get(function (req, res, next) {
            try {
                let data = [];
                if (fs.existsSync(log_path)) {
                    data = fs.readFileSync(log_path, 'utf8').toString().split("\n");
                } 
                res.status(200);
                res.json(data);
            } catch (err) {
                res.status(500);
                res.json(err);
            }


        });

    router.route('/log')
            .post(function (req, res, next) {
                let error = generateRandomErrorCode()
                let result = logError(error)
                if(result === 'saved') {
                    const logs = fs
                      .readFileSync(log_path, "utf8",)
                      .toString()
                      .split("\n");
                      /* Return only the last log entry. */
                    result = logs.slice(logs.length - 2, logs.length -1);
                } else {
                    res.status(500);
                }
                res.json(result);

            });



    return router;


    function generateRandomErrorCode() {
      /* Creating a random number xxxx. */
      return Math.floor(Math.random() * (9999 - 0000) + 0000);
    }

    function logError(error) {
      try {
            let logs = [];

            /* Get the log file. */
            if (fs.existsSync(log_path)) {
              logs = fs
                .readFileSync(log_path, "utf8")
                .toString()
                .split("\n");
            }

            const date = new Date();
            const log_error =
              date.toISOString() + " - ERROR_CODE: " + error + "\n";

            /* Create a new log entry. */
            fs.appendFileSync(log_path, log_error, { encoding: "utf8" });

            /* Point to the time one minute before now. */
            const date_one_minute_before = new Date(date - 60 * 1000);

            /* Get all the logs generated in the last minute. */
            const logs_last_minute = logs.filter(log => {
              const date_log = getLogDate(log);
              return date_log >= date_one_minute_before;
            });

            /* Filter only error logs */
            const errors_logs_last_minute = logs_last_minute.filter(log =>
              log.match("ERROR_CODE")
            );

            if (errors_logs_last_minute.length >= 10) {
              /* Only if it was more than 10 error logs in the last minute, check if a frequently warning has been sent in the last minute. */
              const mail_notification_last_minute = logs_last_minute.find(log =>
                log.match("Frequently Error Reported Vía Email")
              );
              if (typeof mail_notification_last_minute == "undefined") {
                const date = new Date();
                const log_mail =
                  date.toISOString() +
                  " - Frequently Error Reported Vía Email.\n";
                /* Register in the log that the frequently warning has been sent. */
                fs.appendFileSync(log_path, log_mail, { encoding: "utf8" });
              }
            }
            return "saved";
          } catch (err) {
        return err;
      }
    }

    function getLogDate(log) {
      const regex = "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z";
      return new Date(log.match(regex));
    }


};