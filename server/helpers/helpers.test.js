const { typeValidator } = require("./helpers");

test("validate input types for strings", () => {
  //string positive tests
  expect(typeValidator("string", "")).toEqual(true);
  expect(typeValidator("string", "abc")).toEqual(true);
  expect(typeValidator("string", "1")).toEqual(true);
  //string negative tests
  expect(typeValidator("string", [])).toEqual(false);
  expect(typeValidator("string", 1)).toEqual(false);
  expect(typeValidator("string", { 1: 2 })).toEqual(false);
  expect(typeValidator("string", null)).toEqual(false);
  expect(typeValidator("string", undefined)).toEqual(false);
});
