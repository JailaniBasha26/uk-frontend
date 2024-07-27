import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Column } from "primereact/column";
import { Row, Col } from "react-bootstrap";

import axios from "axios";
import AsdaLogo from "../Assests/ASDA.png";
import MorrisonsLogo from "../Assests/Morrisons.png";
import SainsburyLogo from "../Assests/Sainsbury.png";
import TescoLogo from "../Assests/Tesco.png";
import WaitRoseLogo from "../Assests/WaitRose.png";
import OcadoLogo from "../Assests/Ocado.png";
import CoOpLogo from "../Assests/CoOp.png";
import AmazonLogo from "../Assests/Amazon.png";

import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

import "./dashboard.css";

let addProductArray = [];

export default function DashboardNew() {
  const toast = useRef(null);

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [addProductDialogBoxvisible, setAddProductDialogBoxvisible] =
    useState(false);

  const [productName, setProductName] = useState("");
  const categories = [
    { name: "Gin", code: "Gin" },
    { name: "Rum", code: "Rum" },
    { name: "Cider", code: "Cider" },
    { name: "Beer", code: "Beer" },
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const measurements = [
    { name: "Liter", code: "Liter" },
    { name: "Ml", code: "Ml" },
    { name: "Cl", code: "Cl" },
  ];
  const [selectedMeasurement, setSelectedMeasurement] = useState(
    measurements[0]
  );

  const [quantity, setQuantity] = useState(1);

  //Shop URL - START

  const [asdaUrl, setAsdaUrl] = useState("");
  const [morrisonsaUrl, setMorrisonsUrl] = useState("");
  const [sainsburysUrl, setSainsburysUrl] = useState("");
  const [tescoUrl, setTescoUrl] = useState("");
  const [ocadoUrl, setOcadoUrl] = useState("");
  const [coopUrl, setCoopUrl] = useState("");
  const [waitRoseUrl, setWaitRoseUrl] = useState("");
  const [amazonUrl, setAmazonUrl] = useState("");

  const [webLoadingGif, setWebLoadingGif] = useState(false);

  //Shop URL - ENDl̥

  useEffect(() => {
    axios.get("getGridData").then((response) => {
      setProducts(response.data);
    });
  }, []);

  const commonBody = (rowData, shopName) => {
    return (
      <a
        href={rowData[shopName] != undefined && rowData[shopName].url}
        target="_blank"
        className="priceColumn"
        style={{
          color: rowData.lowestPriceShopNameList.some(
            (item) => item.toLowerCase() === shopName.toLowerCase()
          )
            ? "#2ca32c"
            : "black",
        }}
      >
        {rowData[shopName] != undefined && rowData[shopName].price != 0 ? (
          <>
            <i className="euroSymbol">£</i> {rowData[shopName].price}{" "}
          </>
        ) : (
          "-"
        )}
      </a>
    );
  };

  const asdaPriceBody = (rowData) => {
    return commonBody(rowData, "asda");
  };

  const morrisonsPriceBody = (rowData) => {
    return commonBody(rowData, "morrisons");
  };

  const sainsburyPriceBody = (rowData) => {
    return commonBody(rowData, "sainsburys");
  };

  const tescoPriceBody = (rowData) => {
    return commonBody(rowData, "tesco");
  };

  const waitRosePriceBody = (rowData) => {
    return commonBody(rowData, "waitrose");
  };

  const ocadoPriceBody = (rowData) => {
    return commonBody(rowData, "ocado");
  };

  const coopPriceBody = (rowData) => {
    return commonBody(rowData, "coop");
  };

  const amazonPriceBody = (rowData) => {
    return commonBody(rowData, "amazon");
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="dashboardSearchBar">
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search"
        />
      </div>
    );
  };

  const productUrlOnBlur = (e, shopName) => {
    console.log(e.target.value, "??", shopName);

    let userEnteredValue = e.target.value.replace(/ /g, "");

    if (
      userEnteredValue.length !== 0 &&
      userEnteredValue.trim().length !== 0 &&
      userEnteredValue
    ) {
      let existingShopDetail = addProductArray.filter(
        (obj) => obj.shopName == shopName
      );

      addProductArray = addProductArray.filter(
        (obj) => JSON.stringify(obj) !== JSON.stringify(existingShopDetail[0])
      );

      let addProductObj = {
        productName: productName,
        category: selectedCategory.name,
        quantity: quantity,
        measurement: selectedMeasurement.name,
        shopName: shopName,
        url: userEnteredValue,
      };

      addProductArray.push(addProductObj);
    }
  };

  const productImage = (rowData) => {
    return (
      <div class="image-container">
        <img src={rowData.imageUrl} height={40} width={50}></img>
      </div>
    );
  };

  const addProduct = () => {
    setWebLoadingGif(true);

    addProductArray.map((i, idx) => {
      i.productName = productName;
      i.category = selectedCategory.name;
      i.quantity = quantity;
      i.measurement = selectedMeasurement.name;
    });

    axios.post("/insertProductMasterData", addProductArray).then((response) => {
      console.log(response, " !! POST DATA");

      if (response.data) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully added",
          life: 3000,
        });

        axios.get("getGridData").then((response) => {
          setProducts(response.data);
          setWebLoadingGif(false);
        });
      }
    });
  };

  const header = renderHeader();
  console.log(addProductArray, ">>");

  const closeProductDialogBox = () => {
    setAddProductDialogBoxvisible(false);

    setProductName("");
    setSelectedCategory(categories[0]);
    setQuantity(1);
    setSelectedMeasurement(measurements[0]);

    setAsdaUrl("");
    setMorrisonsUrl("");
    setSainsburysUrl("");
    setTescoUrl("");

    setOcadoUrl("");
    setCoopUrl("");
    setWaitRoseUrl("");
    setAmazonUrl("");

    addProductArray = [];
  };

  return (
    <div>
      <div className="addProductBtnDiv">
        <Button
          label="Add Product"
          onClick={() => setAddProductDialogBoxvisible(true)}
          className="addProductBtn"
        />
      </div>

      <Toast ref={toast} />

      <Dialog
        header="Add Product"
        visible={addProductDialogBoxvisible}
        style={{ width: "80vw" }}
        onHide={() => {
          // if (!addProductDialogBoxvisible) return;
          // setAddProductDialogBoxvisible(false);
          closeProductDialogBox();
        }}
      >
        <div
          class="addProductDiv"
          style={{
            visibility: webLoadingGif ? "hidden" : "visible",
          }}
        >
          <div className="addProductMandatoryDiv">
            <Row>
              <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                <label>Product Name</label>
              </Col>
              <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                <InputText
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="addProductName"
                  placeholder="Enter product name"
                />
              </Col>
            </Row>
            <br />

            <Row>
              <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                Category
              </Col>
              <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                <Dropdown
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.value)}
                  options={categories}
                  optionLabel="name"
                  placeholder="Select Category"
                  className="addProductDropdown"
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                Size
              </Col>
              <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                <div className="addProductSizeDiv">
                  <InputNumber
                    inputId="withoutgrouping"
                    value={quantity}
                    onValueChange={(e) => setQuantity(e.value)}
                    useGrouping={false}
                    className="addProductQuantity"
                  />

                  <Dropdown
                    value={selectedMeasurement}
                    onChange={(e) => setSelectedMeasurement(e.value)}
                    options={measurements}
                    optionLabel="name"
                    placeholder="Select Measurement"
                    className="addProductDropdown"
                  />
                </div>
              </Col>
            </Row>
          </div>

          <Row>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}>
              <img src={AsdaLogo} height={30} width={50} />
            </Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <InputText
                value={asdaUrl}
                onChange={(e) => setAsdaUrl(e.target.value)}
                className="addProductShopUrlTextBox"
                placeholder="paste the product url"
                onBlur={(e) => productUrlOnBlur(e, "ASDA")}
              />
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}>
              <img src={MorrisonsLogo} height={30} width={65} />
            </Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <InputText
                value={morrisonsaUrl}
                onChange={(e) => setMorrisonsUrl(e.target.value)}
                className="addProductShopUrlTextBox"
                placeholder="paste the product url"
                onBlur={(e) => productUrlOnBlur(e, "Morrisons")}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}>
              <img src={SainsburyLogo} height={20} width={80} />
            </Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <InputText
                value={sainsburysUrl}
                onChange={(e) => setSainsburysUrl(e.target.value)}
                className="addProductShopUrlTextBox"
                placeholder="paste the product url"
                onBlur={(e) => productUrlOnBlur(e, "Sainsburys")}
              />
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}>
              <img src={TescoLogo} height={25} width={65} />
            </Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <InputText
                value={tescoUrl}
                onChange={(e) => setTescoUrl(e.target.value)}
                className="addProductShopUrlTextBox"
                placeholder="paste the product url"
                onBlur={(e) => productUrlOnBlur(e, "Tesco")}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}>
              <img src={WaitRoseLogo} height={20} width={80} />
            </Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <InputText
                value={waitRoseUrl}
                onChange={(e) => setWaitRoseUrl(e.target.value)}
                className="addProductShopUrlTextBox"
                placeholder="paste the product url"
                onBlur={(e) => productUrlOnBlur(e, "WaitRose")}
              />
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}>
              <img src={OcadoLogo} height={20} width={80} />
            </Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <InputText
                value={ocadoUrl}
                onChange={(e) => setOcadoUrl(e.target.value)}
                className="addProductShopUrlTextBox"
                placeholder="paste the product url"
                onBlur={(e) => productUrlOnBlur(e, "Ocado")}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}>
              <img src={CoOpLogo} height={30} width={40} />
            </Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <InputText
                value={coopUrl}
                onChange={(e) => setCoopUrl(e.target.value)}
                className="addProductShopUrlTextBox"
                placeholder="paste the product url"
                onBlur={(e) => productUrlOnBlur(e, "CoOp")}
              />
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}>
              <img src={AmazonLogo} height={40} width={70} />
            </Col>
            <Col xl={5} lg={5} md={5} sm={5} xs={5}>
              <InputText
                value={amazonUrl}
                onChange={(e) => setAmazonUrl(e.target.value)}
                className="addProductShopUrlTextBox"
                placeholder="paste the product url"
                onBlur={(e) => productUrlOnBlur(e, "Amazon")}
              />
            </Col>
          </Row>

          <br />

          <div className="addProductAddBtnDiv">
            <Button
              label="Add"
              className="addProductAddBtn"
              onClick={() => addProduct()}
            />
          </div>
        </div>

        {webLoadingGif && (
          <div className="spinnerContainerStyle">
            <center>
              <ProgressSpinner
                style={{ width: "50px", height: "50px" }}
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            </center>
          </div>
        )}
      </Dialog>

      <DataTable
        value={products}
        filters={filters}
        header={header}
        globalFilterFields={["productName", "category", "size"]}
        className="addProductGrid"
      >
        <Column body={productImage} style={{ width: "5%" }}></Column>

        <Column
          field="productName"
          header="Product Name"
          style={{ width: "30%" }}
        ></Column>

        <Column field="size" header="Size" style={{ width: "10%" }}></Column>
        <Column
          field="category"
          header="Category"
          style={{ width: "10%" }}
        ></Column>
        <Column
          header={
            <div>
              <img
                src={AsdaLogo}
                alt="Logo"
                style={{
                  height: "25px",
                  width: "45px",
                  verticalAlign: "middle",
                  marginTop: "-10px",
                }}
              />
            </div>
          }
          style={{ width: "10%" }}
          body={asdaPriceBody}
        ></Column>
        <Column
          field="Morrisons"
          header={
            <div>
              <img
                src={MorrisonsLogo}
                alt="Logo"
                style={{
                  height: "35px",
                  width: "70px",
                  verticalAlign: "middle",
                  marginTop: "-10px",
                }}
              />
            </div>
          }
          style={{ width: "10%" }}
          body={morrisonsPriceBody}
        ></Column>
        <Column
          field="Morrisons"
          header={
            <div>
              <img
                src={SainsburyLogo}
                alt="Logo"
                style={{
                  height: "17px",
                  width: "75px",
                  verticalAlign: "middle",
                  marginTop: "3px",
                }}
              />
            </div>
          }
          style={{ width: "10%" }}
          body={sainsburyPriceBody}
        ></Column>
        <Column
          field="Morrisons"
          header={
            <div>
              <img
                src={TescoLogo}
                alt="Logo"
                style={{
                  height: "20px",
                  width: "60px",
                  verticalAlign: "middle",
                }}
              />
            </div>
          }
          style={{ width: "10%" }}
          body={tescoPriceBody}
        ></Column>
        <Column
          field="WaitRose"
          header={
            <div>
              <img
                src={WaitRoseLogo}
                alt="Logo"
                style={{
                  height: "17px",
                  width: "70px",
                  verticalAlign: "middle",
                }}
              />
            </div>
          }
          style={{ width: "10%" }}
          body={waitRosePriceBody}
        ></Column>
        <Column
          field="Ocado"
          header={
            <div>
              <img
                src={OcadoLogo}
                alt="Logo"
                style={{
                  height: "17px",
                  width: "70px",
                  verticalAlign: "middle",
                }}
              />
            </div>
          }
          style={{ width: "10%" }}
          body={ocadoPriceBody}
        ></Column>
        <Column
          field="CoOp"
          header={
            <div>
              <img
                src={CoOpLogo}
                alt="Logo"
                style={{
                  height: "25px",
                  width: "50px",
                  verticalAlign: "middle",
                }}
              />
            </div>
          }
          style={{ width: "10%" }}
          body={coopPriceBody}
        ></Column>
        <Column
          field="Amazon"
          header={
            <div>
              <img
                src={AmazonLogo}
                alt="Logo"
                style={{
                  height: "30px",
                  width: "50px",
                  verticalAlign: "middle",
                }}
              />
            </div>
          }
          style={{ width: "10%" }}
          body={amazonPriceBody}
        ></Column>
      </DataTable>
    </div>
  );
}
