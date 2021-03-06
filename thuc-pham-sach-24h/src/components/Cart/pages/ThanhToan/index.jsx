import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { saveShippingInfo } from "../../../../actions/cartAction";
import { clearErrors, createOrder } from "../../../../actions/orderAction";
import useLocationForm from "../../../../hooks/useLocationForm";
import formatString from "../../../../untils/formatString";
import LocationForm from "../../LocationForm";
import MetaData from "../../MetaData";
import "./thanhtoan.scss";

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

const useStyles = makeStyles({
  root: {
    paddingTop: "15px",
    paddingBottom: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  breadCrumbs: {
    textTransform: "uppercase",
    fontSize: "21px",
  },
  borderForm: {
    border: "2px solid #51aa1b",
    padding: "15px 30px",
    height: "fit-content",
  },
  cartFormTitle: {
    color: "#333",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: "700",
    borderBottom: "3px solid rgba(224, 224, 224, 1)",
    lineHeight: "1.5em",
    padding: "16px",
  },
  tableHead: {
    fontSize: "12px !important",
    lineHeight: "3",
  },
  message: {
    color: "#333",
    fontSize: "13.3px",
  },
  showLogin: {
    transition: "0.2s all linear",
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
      color: "#51aa1b",
    },
  },
  formRow: {
    display: "flex",
    flexDirection: "column",
    margin: "10px 0",
  },
  labelForm: {
    color: "#222",
    fontSize: "12px",
    fontWeight: "700",
    lineHeight: "1.4",
  },
  inputForm: {
    padding: "0 0.75em",
    height: "2.5em",
    color: "#333",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "13px",
    marginTop: "3px",
    // fontSize: "0.97em"
  },
  textareaForm: {
    padding: "10px",
    outline: "none",
    marginTop: "3px",
  },
  tableTitle: {
    fontWeight: "700 !important",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
});

function ThanhToan() {
  const classes = useStyles();
  const breadcrumbs = [
    <Link
      underline="none"
      key="1"
      href="/"
      color="inherit"
      onClick={handleClick}
      className={classes.breadCrumbs}
    >
      Gi??? h??ng
    </Link>,
    <Link
      underline="none"
      key="2"
      color="text.primary"
      href="/thanh-toan"
      onClick={handleClick}
      className={classes.breadCrumbs}
    >
      Thanh to??n
    </Link>,
    <Link
      underline="none"
      key="3"
      color="inherit"
      className={classes.breadCrumbs}
    >
      ho??n t???t
    </Link>,
  ];

  //Handle shipping
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { error, isSubmit } = useSelector((state) => state.newOrder);

  const { state, onCitySelect, onDistrictSelect, onWardSelect, onSubmit } =
    useLocationForm(false);

  const {
    cityOptions,
    districtOptions,
    wardOptions,
    selectedCity,
    selectedDistrict,
    selectedWard,
  } = state;

  useEffect(() => {
    onCitySelect(shippingInfo.selectedCity);
  }, [cityOptions, shippingInfo.selectedCity]);

  const dispatch = useDispatch();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
  const [address, setAddress] = useState(shippingInfo.address);
  const [payment, setPayment] = useState("Chuy???n kho???n ng??n h??ng");
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, []);

  const handleChangePayment = (event) => {
    setPayment(event.target.value);
  };

  console.log(phoneNo, selectedCity, selectedDistrict, selectedWard, address);

  // Handle confirm
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingCharges = 30000;

  const totalPrice = subtotal + shippingCharges;

  const shipInfo = {
    address: shippingInfo.address,
    phoneNo: shippingInfo.phoneNo,
    city: shippingInfo.selectedCity && shippingInfo.selectedCity.label,
    state: selectedDistrict && selectedDistrict.label,
    country: selectedWard && selectedWard.label,
  };

  const order = {
    shippingInfo: shipInfo,
    orderItems: cartItems,
    user: user && user._id,
    itemsPrice: subtotal,
    shippingPrice: shippingCharges,
    totalPrice: totalPrice,
    paymentInfo: {
      id: "abc",
      status: payment,
    },
    orderComments: comments,
  };

  const checkoutSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 9 || phoneNo.length > 9) {
      alert("Phone Number should be 9 digits Long");
      return;
    }
    console.log(order);

    sessionStorage.setItem("order", JSON.stringify(order));
    sessionStorage.setItem(
      "paidAt",
      JSON.stringify(new Date().toLocaleDateString("en-GB"))
    );
    dispatch(
      saveShippingInfo({
        address,
        selectedCity,
        selectedDistrict,
        selectedWard,
        phoneNo,
      })
    );

    dispatch(createOrder(order));
  };

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
    if (isSubmit) {
      history.push("/hoan-tat");
    }
  }, [dispatch, error, alert]);

  return (
    <Container>
      <MetaData title="Thanh to??n" />
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        className={classes.root}
      >
        {breadcrumbs}
      </Breadcrumbs>
      {/* <p className="login-toggle">
        B???n ???? c?? t??i kho???n?{" "}
        <a href="/login" className={classes.showLogin}>
          ???n v??o ????y ????? ????ng nh???p
        </a>
      </p> */}
      <form encType="multipart/form-data" onSubmit={checkoutSubmit}>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={7}
            className="cart-form"
            sx={{
              paddingRight: {
                md: "20px",
              },
            }}
          >
            <Divider sx={{ marginBottom: "8px", border: "1px solid #ccc" }} />
            <Typography variant="h3" fontSize="14.63px" fontWeight="700">
              THANH TO??N V?? GIAO H??NG
            </Typography>
            <p className={classes.formRow}>
              <label htmlFor="billing_last_name" className={classes.labelForm}>
                H??? v?? t??n *
              </label>
              <input
                placeholder="H??? v?? t??n c???a b???n"
                name="billing_last_name"
                id="billing_last_name"
                className={classes.inputForm}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </p>
            <Grid container spacing={{ xs: 0, sm: 3 }}>
              <Grid item xs={12} sm={6}>
                <p className={classes.formRow}>
                  <label htmlFor="billing_phone" className={classes.labelForm}>
                    S??? ??i???n tho???i *
                  </label>
                  <input
                    placeholder="S??? ??i???n tho???i"
                    name="billing_phone"
                    id="billing_phone"
                    required
                    className={classes.inputForm}
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                  />
                </p>
              </Grid>
              <Grid item xs={12} sm={6}>
                <p className={classes.formRow}>
                  <label htmlFor="billing_email" className={classes.labelForm}>
                    ?????a ch??? email *
                  </label>
                  <input
                    placeholder="?????a ch??? email"
                    name="billing_email"
                    id="billing_email"
                    className={classes.inputForm}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                  />
                </p>
              </Grid>
            </Grid>
            <LocationForm
              cityOptions={cityOptions}
              onCitySelect={onCitySelect}
              onDistrictSelect={onDistrictSelect}
              onWardSelect={onWardSelect}
              onSubmit={onSubmit}
              districtOptions={districtOptions}
              wardOptions={wardOptions}
              selectedCity={selectedCity}
              selectedDistrict={selectedDistrict}
              selectedWard={selectedWard}
            />
            <label htmlFor="billing_address" className={classes.labelForm}>
              ?????a ch??? *
            </label>
            <input
              placeholder="?????a ch???"
              name="billing_address"
              id="billing_address"
              className={classes.inputForm}
              style={{ width: "100%" }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <p style={{ display: "flex", alignItems: "center" }}>
              {/* <input type="checkbox" name="createaccount" id="createaccount" />
              <label htmlFor="createaccount" className={classes.message}>
                T???o t??i kho???n m???i?
              </label> */}
            </p>
            <div>
              <Typography variant="h3" fontSize="14.63px" fontWeight="700">
                TH??NG TIN B??? SUNG
              </Typography>
              <p className={classes.formRow}>
                <label htmlFor="order_comments" className={classes.labelForm}>
                  Ghi ch?? ????n h??ng (tu??? ch???n)
                </label>
                <textarea
                  name="order_comments"
                  id="order_comments"
                  cols={5}
                  rows={7}
                  placeholder="Ghi ch?? v??? ????n h??ng, v?? d???: th???i gian hay ch??? d???n ?????a ??i???m giao h??ng chi ti???t h??n."
                  className={classes.textareaForm}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </p>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            className={classes.borderForm}
            sx={{
              marginLeft: {
                xs: "24px",
                md: "0",
              },
              marginTop: {
                xs: "10px",
                md: "0",
              },
            }}
          >
            <Typography variant="h3" fontSize="14.63px" fontWeight="700">
              ????N H??NG C???A B???N
            </Typography>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <th align="left" className={classes.cartFormTitle}>
                      S???n ph???m
                    </th>
                    <th align="right" className={classes.cartFormTitle}>
                      T???m t??nh
                    </th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems &&
                    cartItems.map((item) => (
                      <tr className={classes.tableRow}>
                        <td
                          align="left"
                          className={classes.tableHead}
                          style={{ width: "50%" }}
                        >
                          <span>
                            {item.name} ?? {item.quantity}
                          </span>
                        </td>
                        <td align="right">
                          <span className="cart-price">
                            {formatString(item.price * item.quantity)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  <tr className={classes.tableRow}>
                    <td
                      className={classes.tableHead}
                      style={{ fontWeight: "700" }}
                    >
                      T???m t??nh
                    </td>
                    <td align="right">
                      <span className="cart-price">
                        {formatString(subtotal)}
                      </span>
                    </td>
                  </tr>
                  <tr className={classes.tableRow}>
                    <td
                      className={classes.tableHead}
                      style={{ fontWeight: "700" }}
                    >
                      Giao h??ng
                    </td>
                    <td align="right">
                      <span className="cart-price">
                        {formatString(shippingCharges)}
                      </span>
                    </td>
                  </tr>
                  <tr className={classes.tableRow}>
                    <td
                      className={classes.tableHead}
                      style={{ fontWeight: "700" }}
                    >
                      T???ng
                    </td>
                    <td align="right">
                      <span className="cart-price">
                        {formatString(totalPrice)}
                      </span>
                    </td>
                  </tr>

                  {/* O giua */}
                  <tr>
                    <td colSpan={2}>
                      <RadioGroup
                        name="controlled-radio-buttons-group"
                        value={payment}
                        onChange={handleChangePayment}
                      >
                        <FormControlLabel
                          value="Chuy???n kho???n ng??n h??ng"
                          control={<Radio />}
                          label="Chuy???n kho???n ng??n h??ng"
                          className={classes.labelForm}
                          size="small"
                        />
                        <Typography
                          variant="caption"
                          display="block"
                          gutterBottom
                        >
                          Vui l??ng s??? d???ng M?? ????n h??ng c???a b???n trong ph???n N???i
                          dung thanh to??n.
                        </Typography>
                        <p className={classes.labelForm}>
                          Th??ng tin chuy???n kho???n
                        </p>
                        <p className={classes.labelForm}>
                          S??? T??i kho???n : 370376868
                        </p>
                        <p className={classes.labelForm}>
                          Ng??n h??ng : NH TMCP ?? Ch??u ( ACB)
                        </p>
                        <p className={classes.labelForm}>
                          Ch??? t??i kho???n: V?? Ch?? D??ng
                        </p>
                        <FormControlLabel
                          value="Tr??? ti???n m???t khi nh???n h??ng"
                          control={<Radio />}
                          label="Tr??? ti???n m???t khi nh???n h??ng"
                        />
                      </RadioGroup>
                    </td>
                  </tr>
                  {/* tr2 */}
                  <tr>
                    <td colSpan={2}>
                      {/* <a
                        href="/hoant-tat"
                        className="btn--primary"
                        style={{ marginTop: "10px" }}
                      > */}
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        sx={{
                          mt: 2,
                        }}
                      >
                        ?????t h??ng
                      </Button>
                      {/* </a> */}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <p className={classes.labelForm}>
                        C??c th??ng tin ??i???n v??o ????n h??ng ch??? ph???c v??? cho vi???c b??n
                        h??ng, giao h??ng. Ch??ng t??i ?????m m???t ho??n to??n th??ng tin
                        c?? nh??n c???a kh??ch h??ng.
                      </p>
                    </td>
                  </tr>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default ThanhToan;
