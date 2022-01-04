import React from "react";
import { Store } from "../store/store-reducer";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

interface IProps {}

const Refreshing: React.FC<IProps> = () => {
  const { state } = React.useContext(Store);

  const renderRefreshing = () => {
    return (
      <div>
        <Container
          sx={{
            background: "#F5F5F5  0% 0% no-repeat padding-box",
            borderRadius: "8px",
            opacity: 1,
            marginBottom: "40px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          <Typography>LOADING</Typography>
          <img
            alt="LOADING"
            width="42px"
            height="42px"
            src="/images/loader.gif"
          />{" "}
          <br />
          <Typography noWrap={false}>
            {state.refreshing.message} <br />
          </Typography>
        </Container>
      </div>
    );
  };

  if (state.refreshing.status === true) {
    return renderRefreshing();
  } else {
    return null;
  }
};

export default Refreshing;
