import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Column } from "primereact/column";
import axios from "axios";
import AsdaLogo from "../Assests/ASDA.png";
import MorrisonsLogo from "../Assests/Morrisons.png";
import "./dashboard.css";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    axios.get("getGridData").then((response) => {
      if (response.data.length > 0) {
        let gridResponseData = response.data;

        let groupGridDataByTag = Object.values(
          gridResponseData.reduce((acc, current) => {
            acc[current.tag] = acc[current.tag] ?? [];
            acc[current.tag].push(current);
            return acc;
          }, {})
        );

        let gridData = [];
        groupGridDataByTag.map((tagGroup, tagGroupIdx) => {
          const productWithLowestPrice = tagGroup.reduce((prev, current) => {
            return prev.price < current.price ? prev : current;
          });

          // Check for same price
          const lowestPrice = productWithLowestPrice.price;
          const samePriceProducts = tagGroup.filter(
            (product) => product.price === lowestPrice
          );

          const result =
            samePriceProducts.length > 1 ? [] : productWithLowestPrice;

          tagGroup.map((product, productJdx) => {
            let parentObj = tagGroup[0];

            if (productJdx > 0) {
              parentObj[product.shopName] = product.price;
              parentObj[product.shopName + "url"] = product.url;
            } else {
              parentObj[product.shopName] = product.price;
              parentObj[product.shopName + "url"] = product.url;
            }

            if (tagGroup.length == productJdx + 1) {
              parentObj["lowestSeller"] = result.shopName;
              gridData.push(parentObj);
            }
          });
        });

        setProducts(gridData);
      }
    });
  }, []);

  const statusBodyTemplate = (rowData) => {
    return (
      <a
        href={rowData.ASDAurl}
        target="__blank"
        className="priceColumn"
        style={{
          color:
            rowData.lowestSeller != undefined && rowData.lowestSeller == "ASDA"
              ? "#2ca32c"
              : "black",
        }}
      >
        {rowData.ASDA != undefined ? (
          <>
            <i className="euroSymbol">£</i> {rowData.ASDA}{" "}
          </>
        ) : (
          "-"
        )}
      </a>
    );
  };

  const productImage = (rowData) => {
    return (
      <div class="image-container">
        <img src={rowData.ImageRef} height={40} width={50}></img>
      </div>
    );
  };

  const morrisonsPrice = (rowData) => {
    console.log(rowData, "$$");
    return (
      <a
        href={rowData.Morrisonsurl}
        target="_blank"
        className="priceColumn"
        style={{
          color:
            rowData.lowestSeller != undefined &&
            rowData.lowestSeller == "Morrisons"
              ? "#2ca32c"
              : "black",
        }}
      >
        {rowData.Morrisons != undefined ? (
          <>
            <i className="euroSymbol">£</i> {rowData.Morrisons}{" "}
          </>
        ) : (
          "-"
        )}
      </a>
    );
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

  const header = renderHeader();

  console.log(products);
  return (
    <div className="dashboardGridDiv">
      <DataTable
        value={products}
        filters={filters}
        header={header}
        globalFilterFields={["ProductName"]}
      >
        <Column body={productImage} style={{ width: "5%" }}></Column>
        <Column field="ProductName" header="Product Name"></Column>
        <Column
          header={
            <div>
              <img
                src={AsdaLogo}
                alt="Logo"
                style={{ height: "30px", verticalAlign: "middle" }}
              />
            </div>
          }
          body={statusBodyTemplate}
        ></Column>
        <Column
          field="Morrisons"
          header={
            <div>
              <img
                src={MorrisonsLogo}
                alt="Logo"
                style={{ height: "35px", verticalAlign: "middle" }}
              />
            </div>
          }
          body={morrisonsPrice}
        ></Column>
        <Column
          field="WaitRose"
          header={
            <div>
              <img
                src={MorrisonsLogo}
                alt="Logo"
                style={{ height: "35px", verticalAlign: "middle" }}
              />
            </div>
          }
          body={morrisonsPrice}
        ></Column>
      </DataTable>
    </div>
  );
}
