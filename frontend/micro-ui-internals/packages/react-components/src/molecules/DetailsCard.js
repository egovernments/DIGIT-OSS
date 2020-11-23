const Details = ({ lable, name }) => {
  return (
    <div className="detail">
      <span className="label">
        <h2>{lable}</h2>
      </span>
      <span className="name">{name}</span>
    </div>
  );
};

const DetailsContainer = ({ data }) => {
  return (
    <div className="details-container">
      {data.map(({ lable, name }) => {
        <Details lable={lable} name={name} />;
      })}
    </div>
  );
};
