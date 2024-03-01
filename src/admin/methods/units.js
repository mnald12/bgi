const units = [
  "PIECE",
  "PACK",
  "BOX",
  "ROLL",
  "METER",
  "SET",
  "PAIR",
  "BUNDLE",
];

const products = {
  totalProducts: 0,
  productLists: [
    {
      productId: 131241123213,
      productName: "switch",
      productImage: "",
      unit: "pcs",
      category: "",
      data: {
        totalStocks: 2130,
        currentStocks: 123,
        totalCapital: 123,
        price: 2,
        income: 0,
        capitalPerPcs: 10,
        totalSold: 123,
      },
    },
    {
      productId: 123412451213,
      productName: "outlet",
      productImage: "",
      unit: "pack",
      category: "",
      data: {
        pcsPerPack: 12,
        totalStocks: {
          pack: 12,
          pcs: 11,
        },
        currentStocks: {
          pack: 2,
          pcs: 3,
        },
        totalCapital: 123,
        price: {
          perPack: 0,
          perPcs: 0,
        },
        income: 0,
        capitalPerPack: 10,
        capitalPerPcs: 10,
        totalSold: {
          pack: 122,
          pcs: 11,
        },
      },
    },
    {
      productId: 123412451213,
      productName: "outlet",
      productImage: "",
      unit: "pack",
      category: "",
      data: {
        pcsPerPack: 12,
        totalStocks: {
          pack: 12,
          pcs: 11,
        },
        currentStocks: {
          pack: 2,
          pcs: 3,
        },
        totalCapital: 123,
        income: 0,
        capitalPerPack: 10,
        capitalPerPcs: 10,
        totalSold: {
          pack: 122,
          pcs: 11,
        },
      },
    },
  ],
};
