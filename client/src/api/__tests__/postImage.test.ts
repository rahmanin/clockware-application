import {postImage} from "../postImage"

it("the data have to be a string", () => {
  window.fetch = jest.fn().mockImplementation(() => Promise.resolve(new Response('"stringURL"')))
  return postImage({img: "file"}, "send_image")
    .then(response => {
      expect(typeof response).toBe("string")
    })
})