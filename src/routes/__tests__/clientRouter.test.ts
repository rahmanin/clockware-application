import app from '../../server'
import request from 'supertest'
import city, { City } from '../../models/cities';
import master, { Master } from '../../models/masters';
import user, { User } from '../../models/users';
import size, { Size } from '../../models/sizes';
import order, { Order } from '../../models/orders';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import feedback, {Feedback} from '../../models/feedbacks';
import fse from 'fs-extra';
import news, { News } from '../../models/news';

afterEach(() => app.close())

describe('Get cities', () => {
  beforeEach (() => {
    return city.create<City>({
      id: 666,
      city: "aaaa"
    })
  })
  afterEach (() => {
    return city.destroy<City>({
      truncate: true
    })
  })
  it('should get 200 code and array with city', async () => {
    const res = await request(app).get('/api/cities')
    expect(res.status).toEqual(200)
  })
})

describe('Get masters', () => {
  beforeEach (async() => {
    await  user.create<User>({
      id: 666,
      username: "Name",
      email: "mail@mail.eee"
    })
    return  master.create<Master>({
      id: 666,
      city: "aaaa",
      rating: 5,
      votes: 5
    })
  })
  afterEach (() => {
    return user.destroy<User>({
        where: {id: 666}
      })
  })
  it('should get 200 code and array with master', async () => {
    const res = await request(app).get('/api/masters')
    expect(res.status).toEqual(200)
  })
})

describe('Get sizes', () => {
  beforeEach (() => {
    return size.create<Size>({
      id: 666,
      size: "aaaa",
      price: 666
    })
  })
  afterEach (() => {
    return size.destroy<Size>({
      truncate: true
    })
  })
  it('should get 200 code and array with size', async () => {
    const res = await request(app).get('/api/size')
    expect(res.status).toEqual(200)
  })
})

describe('Get master info by id from token', () => {
  const token = jwt.sign(
    {
      master_id: 666
    }, 
    process.env.SECRETKEY, 
    {
      expiresIn: '1d'
    }
  );
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
    return user.destroy<User>({
      where: {id: 666}
    })
  })
  it('should get 200 code and master by id from token', async () => {
    const res = await request(app)
      .get('/api/select_master_votes')
      .set({
        authorization: token
      })
    expect(res.body.id).toEqual(666)
    expect(res.status).toEqual(200)
  })
})

describe('Check user if exists by email', () => {
  beforeEach (() => {
    return user.create<User>({
      id: 666,
      username: "Name",
      email: "mail@mail.eee",
      role: "client"
    })
  })
  afterEach (() => {
    return user.destroy<User>({
      where: {id: 666}
    })
  })
  it('should get 200 code and user id', async () => {
    const res = await request(app)
      .post('/api/check_user')
      .send({
        username: "Name",
        email: "mail@mail.eee"
      })
    expect(res.body.id).toEqual(666)
    expect(res.status).toEqual(200)
  })
})

describe('Check user if exists by email', () => {
  beforeEach (() => {
    return user.create<User>({
      id: 666,
      username: "Name",
      email: "mail@mail.eee",
      role: "client",
      password: "string"
    })
  })
  afterEach (() => {
    return user.destroy<User>({
      where: {id: 666}
    })
  })
  it('should get 401 code and user email', async () => {
    const res = await request(app)
      .post('/api/check_user')
      .send({
        username: "Name",
        email: "mail@mail.eee"
      })
    expect(res.body.email).toEqual("mail@mail.eee")
    expect(res.status).toEqual(401)
  })
})

describe('Check user if exists by email', () => {
  afterEach (() => {
    return user.truncate<User>({cascade: true})
  })
  it('should get 200 code and user id', async () => {
    const res = await request(app)
      .post('/api/check_user')
      .send({
        username: "Name",
        email: "mail@mail.eee"
      })
    expect(typeof res.body.id).toEqual("number")
    expect(res.status).toEqual(200)
  })
})

describe('Set user password', () => {
  const token = jwt.sign(
    {
      userId: 666,
      registration: true
    }, 
    process.env.SECRETKEY, 
    {
      expiresIn: '1d'
    }
  );
  beforeEach (() => {
    return user.create<User>({
      id: 666,
      username: "Name",
      email: "mail@mail.eee",
      role: "client"
    })
  })
  afterEach (() => {
    return user.destroy<User>({
      where: {id: 666}
    })
  })
  it('should get 200 code and user password is true', async () => {
    const res = await request(app)
      .post('/api/user_set_password')
      .set({
        authorization: token
      })
      .send({
        password: "1111"
      })
    expect(res.body[0].id).toBeTruthy()
    expect(res.status).toEqual(200)
  })
})

describe('Logging in', () => {
  beforeEach (async() => {
    const hash = await bcrypt.hash("1111", 10)
    return user.create<User>({
      id: 666,
      username: "Name",
      email: "mail@mail.eee",
      role: "role",
      password: hash
    })
  })
  afterEach (() => {
    return user.destroy<User>({
      where: {id: 666}
    })
  })
  it('should get 200 code and token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: "mail@mail.eee",
        password: "1111"
      })
    expect(res.body.token).toBeTruthy()
    expect(res.status).toEqual(200)
  })
})

describe('Post order by unregistered client', () => {
  beforeEach (async() => {
    return user.create<User>({
      id: 666,
      username: "Username",
      email: "123test123@mailinator.com",
      role: "role",
    })
  })
  afterEach (() => {
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code, res with message, and send email', async () => {
    const res = await request(app)
      .post('/api/orders_unregistered_client')
      .send({
        username: "Username",
        email: "123test123@mailinator.com",
        size: "Small",
        city: "City",
        order_date: "2020-12-09",
        order_time_start: '8:00',
        order_time_end: '9:00',
        order_master: "Master",
        order_price: 100,
        image: "string Url",
        id: 666
      })
    expect(res.body.msg).toBeTruthy()
    expect(res.status).toEqual(200)
  })
})

describe('Post order by logged client', () => {
  const token = jwt.sign(
    {
      email: "123test123@mailinator.com", 
      userId: 666,
      role: "role",
      username: "Name"
    }, 
    process.env.SECRETKEY, 
    {
      expiresIn: '1d'
    }
  );
  beforeEach (async() => {
    return user.create<User>({
      id: 666,
      username: "Username",
      email: "123test123@mailinator.com",
      role: "role",
    })
  })
  afterEach (() => {
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code, res with message, and send email', async () => {
    const res = await request(app)
      .post('/api/orders_logged_client')
      .set({
        authorization: token
      })
      .send({
        username: "Username",
        email: "123test123@mailinator.com",
        size: "Small",
        city: "City",
        order_date: "2020-12-09",
        order_time_start: '8:00',
        order_time_end: '9:00',
        order_master: "Master",
        order_price: 100,
        image: "string Url",
      })
    expect(res.body.msg).toBeTruthy()
    expect(res.status).toEqual(200)
  })
})

describe('Get orders by city by date', () => {
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
      .post('/api/orders_by_city')
      .send({
        city: "Dnipro",
        order_date: "2020-12-09"
      })
    expect(res.body.length).toBeTruthy()
    expect(res.status).toEqual(200)
  })
  it('should get 200 code and empty array', async () => {
    const res = await request(app)
      .post('/api/orders_by_city')
      .send({
        city: "Dnipro",
        order_date: "2020-12-12"
      })
    expect(res.body.length).toBeFalsy()
    expect(res.status).toEqual(200)
  })
})

describe('Post clients feedback', () => {
  const token = jwt.sign(
    {
      master_id: 666,
      order_id: 100
    }, 
    process.env.SECRETKEY, 
    {
      expiresIn: '1d'
    }
  );
  beforeEach (async () => {
    await user.create<User>({
      id: 666,
      username: "Username",
      email: "123test123@mailinator.com",
      role: "master",
    })
    await master.create<Master>({
      id: 666,
      city: "City",
      rating: null,
      votes: null
    })
    return order.create<Order>({
      order_id: 100,
      city: "Dnipro",
      size: "Small",
      order_date: "2020-12-09",
      order_master: "Username",
      feedback_client_id: null,
      feedback_master: "string",
      order_price: 234,
      additional_price: 234,
      is_done: false,
      master_id: 666,
      order_time_start: "8:00",
      order_time_end: "9:00",
      image: "string Url",
      client_id: 666
    })
  })
  afterEach (async() => {
    await feedback.truncate<Feedback>({
      cascade: true
    })
    return user.truncate<User>({
      cascade: true
    })
  })
  it('should get 200 code and res with message', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .set({
        authorization: token
      })
      .send({
        feedback_client: "String feedback",
        evaluation: 5,
        rating: 5,
        votes: 1
      })
    expect(res.body.msg).toBeTruthy()
    expect(res.status).toEqual(200)
  })
})

describe('Get master feedbacks by master id', () => {
  beforeEach ( () => {
    return feedback.create<Feedback>({
      id: 99,
      feedback: "string",
      evaluation: 5,
      master_id: 666,
      order_id: 100,
      createdAt: new Date(),
    })
  })
  afterEach (() => {
    return feedback.truncate<Feedback>({
      cascade: true
    })
  })
  it('should get 200 code and res with total number and feedbacks', async () => {
    const res = await request(app)
      .post('/api/feedbacks_by_master_id')
      .send({
        master_id: 666
      })
    expect(res.body.totalFeedbacks).toEqual(1)
    expect(res.status).toEqual(200)
  })
})

describe('Upload image', () => {
  afterEach (() => {
    return fse.emptyDir('uploads')
  })
  it('should get 200 code and url', async () => {
    const res = await request(app)
      .post('/api/send_image')
      .field('name', 'image')
      .attach("file", 'src/source/test_image.jpg')
    expect(typeof res.body).toBe("string")
    expect(res.status).toEqual(200)
  })
})

describe('Creating payment', () => {
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
  it('should get 200 code and payLink', async () => {
    const res = await request(app)
      .get('/api/pay/100')
    expect(typeof res.body.payLink).toBe("string")
    expect(res.status).toEqual(200)
  })
})

describe('Get news pagination', () => {
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
  it('should get 200 code and an object', async () => {
    const res = await request(app)
      .post('/api/news_pagination')
    expect(typeof res.body).toBe("object")
    expect(res.status).toEqual(200)
  })
})