






test("sadad",()=>{
    const mock = jest.fn(()=> "i am mock");
    expect(mock("calling")).toBe("i am mock")
})