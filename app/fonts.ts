import localFont from "next/font/local";

export const lemonMilk = localFont({
  src: [
    {
      path: "../lemon-milk-font/LemonMilkLight-owxMq.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../lemon-milk-font/LemonMilkLightItalic-7BjPE.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../lemon-milk-font/LemonMilkRegular-X3XE2.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../lemon-milk-font/LemonMilkRegularItalic-L3AEy.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../lemon-milk-font/LemonMilkMedium-mLZYV.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../lemon-milk-font/LemonMilkMediumItalic-d95nl.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../lemon-milk-font/LemonMilkBold-gx2B3.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../lemon-milk-font/LemonMilkBoldItalic-PKZ3P.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-lemon-milk",
});

