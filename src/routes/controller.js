const helperWrapper = require("../helper/wrapper");
const connection = require("../config/mysql");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (request, response) => {
    try {
      const { username, password } = request.body;

      let data = [];
      await connection
        .promise()
        .query(`SELECT * from user where name = '${username}' `)
        .then(([rows, fields]) => {
          data = rows;
        })
        .catch((err) => {
          throw err;
        });

      if (data.length == 0) {
        return helperWrapper.response(
          response,
          404,
          "username not registered",
          null
        );
      }
      const result = await bcrypt.compare(password, data[0].password);
      if (!result) {
        return helperWrapper.response(response, 404, "Wrong Password", null);
      }
      const payload = data[0];
      delete payload.password;

      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "24h" });

      return helperWrapper.response(response, 200, "Success Login", {
        id: payload.id,
        token,
      });
    } catch (error) {
      console.log(error);
      return helperWrapper.response(
        response,
        500,
        "Internal Server Error",
        null
      );
    }
  },
  register: async (request, response) => {
    try {
      let { username, password } = request.body;

      let data = [];
      await connection
        .promise()
        .query(`SELECT * from user where name = '${username}' `)
        .then(([rows, fields]) => {
          data = rows;
        })
        .catch((err) => {
          throw err;
        });
      console.log(data.length, "data");
      if (data.length > 0) {
        return helperWrapper.response(response, 404, "Username was used", null);
      }
      if (data.length == 0) {
        let salt = bcrypt.genSaltSync(10);
        let newPassword = bcrypt.hashSync(password, salt);
        const setData = {
          id: uuidv4(),
          name: username,
          password: newPassword,
          created_at: new Date(),
        };
        await connection
          .promise()
          .query(`INSERT into user set ?`, setData)
          .then(([rows, fields]) => {
            console.log(rows);
          })
          .catch((err) => {
            throw err;
          });
        return helperWrapper.response(response, 200, "Register Success");
      }
    } catch (error) {
      console.log(error);
      return helperWrapper.response(
        response,
        500,
        "Internal Server Error",
        null
      );
    }
  },
  getOrder: async (request, response) => {
    try {
      const { startDate, endDate } = request.body;
      let data = [];
      if (!startDate && !endDate) {
        await connection
          .promise()
          .query(`select * from pelanggan`)
          .then(([rows, fields]) => {
            data = rows;
          })
          .catch((err) => {
            throw err;
          });
      } else {
        await connection
          .promise()
          .query(
            `select * from pelanggan where tanggal BETWEEN '${startDate}' AND '${endDate}'`
          )
          .then(([rows, fields]) => {
            data = rows;
          })
          .catch((err) => {
            throw err;
          });
      }
      return helperWrapper.response(response, 200, "Get Data Success", data);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(
        response,
        500,
        "Internal Server Error",
        null
      );
    }
  },
  getOrderById: async (request, response) => {
    try {
      const { id } = request.params;

      let data = [];
      await connection
        .promise()
        .query(`select * from pelanggan where id = '${id}'`)
        .then(([rows, fields]) => {
          data = rows;
        })
        .catch((err) => {
          throw err;
        });

      if (data.length == 0) {
        return helperWrapper.response(response, 404, "Data Not Found");
      }

      return helperWrapper.response(response, 200, "Get Data Success", data);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(
        response,
        500,
        "Internal Server Error",
        null
      );
    }
  },
  postOrder: async (request, response) => {
    try {
      const {
        tanggal,
        nama,
        telepon,
        layanan,
        beratCucian,
        jumlahPakaian,
        aromaParfum,
        hargaTotal,
        status,
      } = request.body;
      if (
        !tanggal ||
        !nama ||
        !telepon ||
        !layanan ||
        !beratCucian ||
        !jumlahPakaian ||
        !aromaParfum ||
        !hargaTotal ||
        !status
      ) {
        return helperWrapper.response(
          response,
          404,
          "Please fill all field",
          null
        );
      }
      const id = uuidv4();
      const setData = {
        id: id,
        tanggal,
        nama,
        telepon,
        layanan,
        beratCucian: beratCucian * 1,
        jumlahPakaian: jumlahPakaian * 1,
        aromaParfum,
        hargaTotal: hargaTotal * 1,
        status,
        created_at: new Date(),
      };
      await connection
        .promise()
        .query(`INSERT into pelanggan set ?`, setData)
        .then(([rows, fields]) => {
          console.log(rows);
        })
        .catch((err) => {
          throw err;
        });

      return helperWrapper.response(response, 200, "Success Create Data", {
        id: id,
      });
    } catch (error) {
      console.log(error);
      return helperWrapper.response(
        response,
        500,
        "Internal Server Error",
        null
      );
    }
  },
  deleteOrder: async (request, response) => {
    try {
      const { id } = request.params;
      let data = [];
      await connection
        .promise()
        .query(`select * from pelanggan where id =?`, id)
        .then(([rows, fields]) => {
          data = rows;
        })
        .catch((err) => {
          throw err;
        });
      if (data.length == 0) {
        return helperWrapper.response(response, 404, "Data Not Found", null);
      }
      await connection
        .promise()
        .query(`DELETE FROM pelanggan where id =?`, id)
        .then(([rows, fields]) => {
          console.log(rows);
        })
        .catch((err) => {
          throw err;
        });
      return helperWrapper.response(response, 200, "Success Delete Data");
    } catch (error) {
      console.log(error);
      return helperWrapper.response(
        response,
        500,
        "Internal Server Error",
        null
      );
    }
  },
};
