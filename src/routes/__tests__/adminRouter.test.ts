import app from '../../server'
import request from 'supertest'
import city, { City } from '../../models/cities';
import master, { Master } from '../../models/masters';
import user, { User } from '../../models/users';
import size, { Size } from '../../models/sizes';
import order, { Order } from '../../models/orders';
import jwt from 'jsonwebtoken';
import news, { News } from '../../models/news';
import { google } from 'googleapis';
import googleController from "../../google/google"

const tokenAdmin = jwt.sign(
  {
    role: "admin"
  }, 
  process.env.SECRETKEY, 
  {
    expiresIn: '1d'
  }
);

const tokenMaster = jwt.sign(
  {
    role: "master",
    userId: 123
  }, 
  process.env.SECRETKEY, 
  {
    expiresIn: '1d'
  }
);

afterEach(() => app.close())

describe('POST create master', () => {
  afterEach (() => {
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code and master as object', async () => {
    const res = await request(app)
      .post('/api/masters')
      .set({
        authorization: tokenAdmin
      })
      .send({
        master_name: "Name",
        city: "City",
        email: "mail@mail.eee",
      })
    expect(typeof res.body).toBe("object")
    expect(res.status).toEqual(200)
  })
})

describe('Delete master', () => {
  beforeEach (async() => {
    await user.create<User>({
      id: 666,
      username: "Name",
      email: "mail@mail.eee"
    })
    return master.create<Master>({
      id: 666,
      city: "aaaa",
      rating: 5,
      votes: 5
    })
  })
  afterEach (() => {
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code', async () => {
    const res = await request(app)
      .delete('/api/masters/666')
      .set({
        authorization: tokenAdmin
      })
      expect(res.status).toEqual(200)
  })
})

describe('Update master', () => {
  beforeEach (async() => {
    await user.create<User>({
      id: 666,
      username: "Name",
      email: "mail@mail.eee"
    })
    return master.create<Master>({
      id: 666,
      city: "aaaa",
      rating: 5,
      votes: 5
    })
  })
  afterEach (() => {
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code', async () => {
    const res = await request(app)
      .put('/api/masters/666')
      .set({
        authorization: tokenAdmin
      })
      .send({
        master_name: "New name",
        city: "New city",
        email: "new@email.eee",
      })
      expect(res.status).toEqual(200)
  })
})

describe('Set master password', () => {
  beforeEach (async() => {
    await user.create<User>({
      id: 666,
      username: "Name",
      email: "mail@mail.eee"
    })
    return master.create<Master>({
      id: 666,
      city: "aaaa",
      rating: 5,
      votes: 5
    })
  })
  afterEach (() => {
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code', async () => {
    const res = await request(app)
      .put('/api/masterPass/666')
      .set({
        authorization: tokenAdmin
      })
      .send({
        password: "password",
      })
      expect(res.status).toEqual(200)
  })
})

describe('POST create city', () => {
  afterEach (() => {
    return city.truncate<City>({
      cascade: true
    })
  })
  it('should get 200 code and city as object', async () => {
    const res = await request(app)
      .post('/api/cities')
      .set({
        authorization: tokenAdmin
      })
      .send({
        city: "City",
      })
    expect(typeof res.body).toBe("object")
    expect(res.status).toEqual(200)
  })
})

describe('Delete city', () => {
  beforeEach (() => {
    return city.create<City>({
      id: 666,
      city: "City",
    })
  })
  afterEach (() => {
    return city.truncate<City>({
      cascade: true
    })
  })
  it('should get 200 code', async () => {
    const res = await request(app)
      .delete('/api/cities/666')
      .set({
        authorization: tokenAdmin
      })
      expect(res.status).toEqual(200)
  })
})

describe('Update city', () => {
  beforeEach (() => {
    return city.create<City>({
      id: 666,
      city: "City",
    })
  })
  afterEach (() => {
    return city.truncate<City>({
      cascade: true
    })
  })
  it('should get 200 code', async () => {
    const res = await request(app)
      .put('/api/cities/666')
      .set({
        authorization: tokenAdmin
      })
      .send({
        city: "New City"
      })
      expect(res.status).toEqual(200)
  })
})

describe('Update price', () => {
  beforeEach (() => {
    return size.create<Size>({
      id: 666,
      price: 999,
      size: "Small"
    })
  })
  afterEach (() => {
    return size.truncate<Size>({
      cascade: true
    })
  })
  it('should get 200 code', async () => {
    const res = await request(app)
      .put('/api/prices/666')
      .set({
        authorization: tokenAdmin
      })
      .send({
        price: 100
      })
      expect(res.status).toEqual(200)
  })
})

describe('Finish order', () => {
  beforeEach (async () => {
    await user.create<User>({
      id: 666,
      username: "Username",
      email: "123test123@mailinator.com",
      role: "role",
    })
    return order.create<Order>({
      order_id: 100,
      city: "Dnipro",
      size: "Small",
      order_date: "2020-12-09",
      order_master: "string",
      feedback_client_id: null,
      feedback_master: "string",
      order_price: 234,
      additional_price: 234,
      is_done: false,
      master_id: 123,
      order_time_start: "8:00",
      order_time_end: "9:00",
      image: "string Url",
      client_id: 666
    })
  })
  afterEach (() => {
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code and send an email', async () => {
    const res = await request(app)
      .put('/api/orders/100')
      .set({
        authorization: tokenMaster
      })
      .send({
        feedback_master: "feedback",
        additional_price: 111,
        is_done: true,
        email: "123test123@mailinator.com",
      })
    expect(res.status).toEqual(200)
  })
})

describe('Update order', () => {
  beforeEach (async () => {
    const auth = await googleController.googleAuthenticate()
    await google.calendar('v3').events.insert({
      auth: auth,
      calendarId: googleController.CALENDAR_ID,
      requestBody: {
        summary: `100`,
        location: `${city}`,
        description: `any`,
        start: {
          'dateTime': "2020-12-09T08:00:00+02:00",
          'timeZone': 'Europe/Kiev',
        },
        end: {
          'dateTime': "2020-12-09T09:00:00+02:00",
          'timeZone': 'Europe/Kiev',
        },
      },
    })
    await user.create<User>({
      id: 666,
      username: "Username",
      email: "123test123@mailinator.com",
      role: "role",
    })
    return order.create<Order>({
      order_id: 100,
      city: "Dnipro",
      size: "Small",
      order_date: "2020-12-09",
      order_master: "string",
      feedback_client_id: null,
      feedback_master: "string",
      order_price: 234,
      additional_price: 234,
      is_done: false,
      master_id: 123,
      order_time_start: "8:00",
      order_time_end: "9:00",
      image: "string Url",
      client_id: 666
    })
  })
  afterEach (async() => {
    const auth = await googleController.googleAuthenticate()
    const eventsList = await google.calendar('v3').events.list({
      auth: auth,
      calendarId: googleController.CALENDAR_ID,
      timeMax: "2020-12-10T00:00:00+02:00",
      timeMin: "2020-12-08T23:59:59+02:00"
    })
    await google.calendar('v3').events.delete({
      auth: auth,
      calendarId: googleController.CALENDAR_ID,
      eventId: eventsList.data.items[0].id
    })
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code', async () => {
    const res = await request(app)
      .put('/api/update_order/100')
      .set({
        authorization: tokenAdmin
      })
      .send({
        size: "Large",
        city: "New City",
        order_date: "2020-12-09",
        order_time_start: `8:00`,
        order_time_end: `11:00`,
        order_master: "New Master",
        master_id: 111,
        email: "any@mail.mail"
      })
    expect(res.status).toEqual(200)
  })
})

describe("Check token", () => {
  it("should pass checking and send an object with user params", async() => {
    const res = await request(app)
      .post("/api/check_token")
      .set({
        authorization: tokenAdmin
      })
      expect(res.body.role).toBe("admin")
      expect(res.status).toEqual(200)
  })
})

describe('Get orders with pagination', () => {
  beforeEach (async () => {
    await user.create<User>({
      id: 666,
      username: "Username",
      email: "123test123@mailinator.com",
      role: "role",
    })
    return order.create<Order>({
      order_id: 100,
      city: "Dnipro",
      size: "Small",
      order_date: "2020-12-09",
      order_master: "string",
      feedback_client_id: null,
      feedback_master: "string",
      order_price: 234,
      additional_price: 234,
      is_done: false,
      master_id: 123,
      order_time_start: "8:00",
      order_time_end: "9:00",
      image: "string Url",
      client_id: 666
    })
  })
  afterEach (() => {
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code and object with data', async () => {
    const res = await request(app)
      .post('/api/orders_filter_sort')
      .set({
        authorization: tokenAdmin
      })
      .send({
        page: 0,
        size: 2,
        sortBy: {
          order_date: true,
        },
        show_all: true,
      })
    expect(typeof res.body).toBe("object")
    expect(res.body.orders.length).toBeTruthy()
    expect(res.status).toEqual(200)
  })
})

describe('Delete order', () => {
  beforeEach (async () => {
    const auth = await googleController.googleAuthenticate()
    await google.calendar('v3').events.insert({
      auth: auth,
      calendarId: googleController.CALENDAR_ID,
      requestBody: {
        summary: `100`,
        location: `${city}`,
        description: `any`,
        start: {
          'dateTime': "2020-12-09T08:00:00+02:00",
          'timeZone': 'Europe/Kiev',
        },
        end: {
          'dateTime': "2020-12-09T09:00:00+02:00",
          'timeZone': 'Europe/Kiev',
        },
      },
    })
    await user.create<User>({
      id: 666,
      username: "Username",
      email: "123test123@mailinator.com",
      role: "role",
    })
    return order.create<Order>({
      order_id: 100,
      city: "Dnipro",
      size: "Small",
      order_date: "2020-12-09",
      order_master: "string",
      feedback_client_id: null,
      feedback_master: "string",
      order_price: 234,
      additional_price: 234,
      is_done: false,
      master_id: 123,
      order_time_start: "8:00",
      order_time_end: "9:00",
      image: "string Url",
      client_id: 666
    })
  })
  afterEach (() => {
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code', async () => {
    const res = await request(app)
      .delete('/api/orders/100')
      .set({
        authorization: tokenAdmin
      })
    expect(res.status).toEqual(200)
  })
})

describe('Find master', () => {
  beforeEach (async() => {
    await user.create<User>({
      id: 666,
      username: "Alex Master",
      email: "mail@mail.eee"
    })
    return master.create<Master>({
      id: 666,
      city: "aaaa",
      rating: 5,
      votes: 5
    })
  })
  afterEach (() => {
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code and array of masters', async () => {
    const res = await request(app)
      .post('/api/find_master')
      .set({
        authorization: tokenAdmin
      })
      .send({
        searchParam: "Ale"
      })
      expect(res.body.length).toBeTruthy()
      expect(res.status).toEqual(200)
  })
})

describe('Get order diagram info', () => {
  beforeEach (async () => {
    await user.create<User>({
      id: 666,
      username: "Username",
      email: "123test123@mailinator.com",
      role: "role",
    })
    return order.create<Order>({
      order_id: 100,
      city: "Dnipro",
      size: "Small",
      order_date: "2020-12-09",
      order_master: "string",
      feedback_client_id: null,
      feedback_master: "string",
      order_price: 234,
      additional_price: 234,
      is_done: false,
      master_id: 123,
      order_time_start: "8:00",
      order_time_end: "9:00",
      image: "string Url",
      client_id: 666
    })
  })
  afterEach (() => {
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code and array of orders', async () => {
    const res = await request(app)
      .post('/api/orders_diagram')
      .set({
        authorization: tokenAdmin
      })
      .send({
        city: [],
        master_params: [],
        order_date_start: null,
        order_date_end: null,
      })
    expect(res.body.length).toBeTruthy
    expect(res.status).toEqual(200)
  })
})

describe('Create news', () => {
  afterEach (() => {
    return news.truncate<News>({
      cascade: true
    })
  })
  it('should get 200 code', async () => {
    const res = await request(app)
      .post('/api/news')
      .set({
        authorization: tokenAdmin
      })
      .send({
        title: "NEW",
        content: "SMTH",
      })
    expect(res.status).toEqual(200)
  })
})

describe('Update news', () => {
  beforeEach (async () => {
    return news.create<News>({
      id: 1,
      title: "aa",
      content: "a",
      createdAt: new Date()
    })
  })
  afterEach (() => {
    return news.truncate<News>({
      cascade: true
    })
  })
  it('should get 200 code', async () => {
    const res = await request(app)
      .put('/api/news/1')
      .set({
        authorization: tokenAdmin
      })
      .send({
        title: "NEW",
        content: "SMTH"
      })
    expect(res.status).toEqual(200)
  })
})

describe('Delete news', () => {
  beforeEach (async () => {
    return news.create<News>({
      id: 1,
      title: "aa",
      content: "a",
      createdAt: new Date()
    })
  })
  afterEach (() => {
    return news.truncate<News>({
      cascade: true
    })
  })
  it('should get 200 code', async () => {
    const res = await request(app)
      .delete('/api/news/1')
      .set({
        authorization: tokenAdmin
      })
    expect(res.status).toEqual(200)
  })
})

describe('Get news list', () => {
  beforeEach (async () => {
    return news.create<News>({
      id: 1,
      title: "aa",
      content: "a",
      createdAt: new Date()
    })
  })
  afterEach (() => {
    return news.truncate<News>({
      cascade: true
    })
  })
  it('should get 200 code and an array', async () => {
    const res = await request(app)
      .get('/api/newsList')
    expect(res.body.length).toBeTruthy()
    expect(res.status).toEqual(200)
  })
})