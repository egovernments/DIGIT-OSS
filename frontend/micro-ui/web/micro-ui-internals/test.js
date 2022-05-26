const middleWare_1 = (data, _break, _next) => {
  data.a = "a";
  _next(data);
};

const middleWare_2 = (data, _break, _next) => {
  data.b = "b";
  //   _break();
  _next(data);
};

const middleWare_3 = (data, _break, _next) => {
  data.c = "c";
  _next(data);
};

let middleWares = [middleWare_1, middleWare_2, middleWare_3];

const callMiddlewares = () => {
  let applyBreak = false;
  let itr = -1;
  let _break = () => (applyBreak = true);
  let _next = (data) => {
    if (!applyBreak && ++itr < middleWares.length) middleWares[itr](data, _break, _next);
    else return;
  };
  _next({});
};

callMiddlewares();
