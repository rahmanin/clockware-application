import dateTime from "../dateTime";

it("DateTime shold be an object", () => {
  expect(typeof dateTime).toBe("object")
  expect(Object.keys(dateTime).length).toBe(3)
})