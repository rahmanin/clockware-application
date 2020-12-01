import {updateElement} from "../updateElement"

it("the data have to be a string", () => {
  window.fetch = jest.fn().mockImplementation(() => Promise.resolve(new Response('{"any":"smth"}')))
  return updateElement({key: "value"}, "action", "endpoint", 1)
    .then(response => {
      expect(typeof response).toBe("object")
    })
})