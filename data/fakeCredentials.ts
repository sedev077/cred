// data/fakeCredentials.ts
type FakeCredentialsProps = {
  id: string,
  service: string,
  username: string,
  password: string,
  passwordPlaceholder: string,
  icon: string,
}

export const fakeCredentials: FakeCredentialsProps[] = [
  {
    id: "1",
    service: "Gmail",
    username: "seydina.badiane@gmail.com",
    password: "mySuperSecret123",
    passwordPlaceholder: "●●●●●●●●●●",
    icon: require("../assets/images/gmail.png"),
  },
  {
    id: "2",
    service: "iCloud",
    username: "seydina@icloud.com",
    password: "iLoveApple2024",
    passwordPlaceholder: "●●●●●●●●●●",
    icon: require("../assets/images/icloud.png"),
  },
  {
    id: "3",
    service: "GitHub",
    username: "seydinaDev",
    password: "gitHubRocks!@#",
    passwordPlaceholder: "●●●●●●●●●●",
    icon: require("../assets/images/github.png"),
  },
  {
    id: "4",
    service: "Netflix",
    username: "seydina.netflix",
    password: "MoviesAreLife!",
    passwordPlaceholder: "●●●●●●●●●●",
    icon: require("../assets/images/netflix.png"),
  },
  {
    id: "5",
    service: "Laptop",
    username: "MacBook Pro",
    password: "macosSecurePwd!",
    passwordPlaceholder: "●●●●●●●●●●",
    icon: require("../assets/images/linux.png"),
  },
  {
    id: "6",
    service: "Facebook",
    username: "seydina.badiane",
    password: "CantHackMe123",
    passwordPlaceholder: "●●●●●●●●●●",
    icon: require("../assets/images/facebook.png"),
  },
];