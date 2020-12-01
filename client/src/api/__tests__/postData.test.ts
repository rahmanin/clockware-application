import {postData} from "../postData"

it("the data have to be a string", () => {
  window.fetch = jest.fn().mockImplementation(() => Promise.resolve(new Response('{"any":"smth"}')))
  return postData({img: "file"}, "send_image")
    .then(response => {
      expect(typeof response).toBe("object")
    })
})