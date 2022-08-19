"use strict";

/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");
const { BadRequestError } = require("../expressError");

/** A reservation for a party */

class Reservation {
  constructor({ id, customerId, numGuests, startAt, notes }) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** getter for numGuests */

  get numGuests() {
    console.log("_numGuests", this._numGuests);
    return this._numGuests;
  }

  /** setter for numGuests */

  set numGuests(numGuests) {
    if (numGuests < 1) {
      throw new BadRequestError("There needs to be at least one guest");
    }
    this._numGuests = numGuests;
  }

  /** formatter for startAt */

  getFormattedStartAt() {
    return moment(this.startAt).format("MMMM Do YYYY, h:mm a");
  }

  /** getter for startAt */

  get startAt() {
    return this._startAt;
  }

  /** setter for startAt */

  set startAt(date) {
    this._startAt = new Date(date);
  }

  /** getter for customerId */

  get customerId() {
    return this._customerId;
  }

  /** setter for customerId */

  set customerId(id) {
    if (this._customerId) {
      throw new BadRequestError(`This reservation is already
                                 assigned to a customer`);
    }
    this._customerId = id;
  }




  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
      `SELECT id,
                  customer_id AS "customerId",
                  num_guests AS "numGuests",
                  start_at AS "startAt",
                  notes AS "notes"
           FROM reservations
           WHERE customer_id = $1`,
      [customerId],
    );

    return results.rows.map(row => new Reservation(row));
  }

  /** save a reservation */

  // id auto generated from SQL
  // customer_id is passed in route as req.params.customer_id

  async save() {
    // if reservation id doesnt exist, create a new reservation
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO reservations (customer_id, num_guests, start_at, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
        [this.customerId, this.numGuests, this.startAt, this.notes],
      );
      this.id = result.rows[0].id;
    }

    // TODO: update reservation
    //  else {
    //     // update existing reservation
    //     await db.query(
    //           `UPDATE customers
    //            SET customer_id = $1,
    //                num_guests = $2,
    //                start_at = $3,
    //                notes = $4
    //            WHERE id = $5`, [
    //           this.customerId,
    //           this.numGuests,
    //           this.phone,
    //           this.notes,
    //           this.id,
    //         ],
    //     );
    //   }
    // }

  }
}


module.exports = Reservation;
