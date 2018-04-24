using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using NetApp_Final_.Models;

namespace NetApp_Final_.Controllers
{
    public class CardInformationsController : ApiController
    {
        private theflowershopEntities2 db = new theflowershopEntities2();

        // GET: api/CardInformations
        public IQueryable<CardInformation> GetCardInformations()
        {
            return db.CardInformations;
        }

        // GET: api/CardInformations/5
        [ResponseType(typeof(CardInformation))]
        public IHttpActionResult GetCardInformation(int id)
        {
            CardInformation cardInformation = db.CardInformations.Find(id);
            if (cardInformation == null)
            {
                return NotFound();
            }

            return Ok(cardInformation);
        }

        // PUT: api/CardInformations/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCardInformation(int id, CardInformation cardInformation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cardInformation.CardID)
            {
                return BadRequest();
            }

            db.Entry(cardInformation).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CardInformationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/CardInformations
        [ResponseType(typeof(CardInformation))]
        public IHttpActionResult PostCardInformation(CardInformation cardInformation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CardInformations.Add(cardInformation);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cardInformation.CardID }, cardInformation);
        }

        // DELETE: api/CardInformations/5
        [ResponseType(typeof(CardInformation))]
        public IHttpActionResult DeleteCardInformation(int id)
        {
            CardInformation cardInformation = db.CardInformations.Find(id);
            if (cardInformation == null)
            {
                return NotFound();
            }

            db.CardInformations.Remove(cardInformation);
            db.SaveChanges();

            return Ok(cardInformation);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CardInformationExists(int id)
        {
            return db.CardInformations.Count(e => e.CardID == id) > 0;
        }
    }
}