let inputs = "eyJmYWlsUnVuIjp7Im1lc3NhZ2UiOiJXYWl0IHVudGlsIGVsZW1lbnQgXCIqW2lkPVwiY2FydF9saW5rX2hlYWRlclwiXSAoIzEpXCIgdmlzaWJsZSA6IEVycm9yOiBObyB2aXNpYmxlIGVsZW1lbnQgZm91bmQgZm9yIHNlbGVjdG9yOiAqW2lkPVwiY2FydF9saW5rX2hlYWRlclwiXSAoIzEpIiwiZXJyb3IiOiJObyB2aXNpYmxlIGVsZW1lbnQgZm91bmQgZm9yIHNlbGVjdG9yOiAqW2lkPVwiY2FydF9saW5rX2hlYWRlclwiXSAoIzEpIiwic3RlcCI6eyJsYWJlbCI6IlNlIHJlbmRyZSBzdXIgbGEgcGFnZSBkdSBwYW5pZXIiLCJudW1iZXIiOjE1LCJjYXRlZ29yeSI6InVuZGVmaW5lZCIsInByaW9yaXR5Ijoibm9uX2Jsb2NraW5nIiwiY29kZSI6IjMtMSJ9LCJibG9jayI6eyJ0eXBlIjoibW91c2UiLCJjb2RlIjoiY2xpY2siLCJwYXJhbWV0ZXJzIjp7InZpc2liaWxpdHkiOiJ2aXNpYmxlIiwidGV4dENvbnRlbnQiOiIifX0sInNlbGVjdG9ycyI6WyIqW2lkPVwiY2FydF9saW5rX2hlYWRlclwiXSJdLCJ3ZWJzaXRlIjp7ImN1cnJlbnRVcmwiOnsicHJvdG9jb2wiOiJodHRwczoiLCJob3N0Ijoic2VjdXJlLnNpc2xleS1wYXJpcy5jb20iLCJwYXRoIjoiXC9qYS1KUFwvY3VzdG9tZXJcL2FjY291bnRcLyIsInNlYXJjaCI6bnVsbCwiaGFzaCI6bnVsbH0sImN1cnJlbnRTdGF0dXMiOjIwMH0sInNjcmVlbnNob3RzIjp7InZpZXdwb3J0IjoiY2FwdHVyZS5jdXN0b20tMTkyMHgxMDgwLnNjZW5hcmlvLWZhaWx1cmUucG5nIiwiZnVsbHNjcmVlbiI6ImNhcHR1cmUuZnVsbHNjcmVlbi0weDAuMC1mYWlsLWNhcHR1cmUucG5nIn19LCJydW5Ub0NvbXBhcmUiOnsibWVzc2FnZSI6IldhaXQgdW50aWwgZWxlbWVudCBcIipbaWQ9XCJjYXJ0X2xpbmtfaGVhZGVyXCJdICgjMSlcIiB2aXNpYmxlIDogRXJyb3I6IE5vIHZpc2libGUgZWxlbWVudCBmb3VuZCBmb3Igc2VsZWN0b3I6ICpbaWQ9XCJjYXJ0X2xpbmtfaGVhZGVyXCJdICgjMSkiLCJlcnJvciI6Ik5vIHZpc2libGUgZWxlbWVudCBmb3VuZCBmb3Igc2VsZWN0b3I6ICpbaWQ9XCJjYXJ0X2xpbmtfaGVhZGVyXCJdICgjMSkiLCJzdGVwIjp7ImxhYmVsIjoiU2UgcmVuZHJlIHN1ciBsYSBwYWdlIGR1IHBhbmllciIsIm51bWJlciI6MTUsImNhdGVnb3J5IjoidW5kZWZpbmVkIiwicHJpb3JpdHkiOiJub25fYmxvY2tpbmciLCJjb2RlIjoiMy0xIn0sImJsb2NrIjp7InR5cGUiOiJtb3VzZSIsImNvZGUiOiJjbGljayIsInBhcmFtZXRlcnMiOnsidmlzaWJpbGl0eSI6InZpc2libGUiLCJ0ZXh0Q29udGVudCI6IiJ9fSwic2VsZWN0b3JzIjpbIipbaWQ9XCJjYXJ0X2xpbmtfaGVhZGVyXCJdIl0sIndlYnNpdGUiOnsiY3VycmVudFVybCI6eyJwcm90b2NvbCI6Imh0dHBzOiIsImhvc3QiOiJzZWN1cmUuc2lzbGV5LXBhcmlzLmNvbSIsInBhdGgiOiJcL2phLUpQXC9jdXN0b21lclwvYWNjb3VudFwvIiwic2VhcmNoIjpudWxsLCJoYXNoIjpudWxsfSwiY3VycmVudFN0YXR1cyI6MjAwfSwic2NyZWVuc2hvdHMiOnsidmlld3BvcnQiOiJjYXB0dXJlLmN1c3RvbS0xOTIweDEwODAuc2NlbmFyaW8tZmFpbHVyZS5wbmciLCJmdWxsc2NyZWVuIjoiY2FwdHVyZS5mdWxsc2NyZWVuLTB4MC4wLWZhaWwtY2FwdHVyZS5wbmcifX19"
inputs = Buffer.from(inputs, "base64");
inputs = JSON.parse(inputs.toString("utf8"));
console.log(inputs)
return inputs

//$ node commandLineDegenerator.js