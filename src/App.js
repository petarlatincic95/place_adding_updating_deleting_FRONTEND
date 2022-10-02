import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [placesPerPage, setPlacesPerPage] = useState([]);
  const [placeObject, setPlaceObject] = useState([]);

  const [newPlaceCountry, setNewPlaceCountry] = useState("");
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceZipCode, setNewPlaceZipCode] = useState("");
  const [clicked, setClicked] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [placeToEdit, setPlaceToEdit] = useState();
  const [changePage, setChangePage] = useState("");
  const [editPlaceName, setEditPlaceName] = useState("");
  const [editPlaceZipCode, setEditPlaceZipCode] = useState("");

  const handleChangeCountry = (event) => {
    setNewPlaceCountry(event.target.value);
  };

  const handleChangePlace = (event) => {
    setNewPlaceName(event.target.value);
  };

  const handleChangeZipCode = (event) => {
    setNewPlaceZipCode(event.target.value);
  };

  const deletePlace = async (id) => {
    await fetch(`http://localhost:5077/api/Place/${id}`, { method: "DELETE" })
      .then((res) => console.log(res))
      .then((data) => console.log(data));
    setClicked(!clicked);
  };

  const handlePage = () => {
    fetch(`http://localhost:5077/api/Place/${changePage}`)
      .then((res) => res.json())
      .then((data) => {
        setPlacesPerPage(data.places);
        setPlaceObject(data);
      });
  };

  const editPlace = (place) => {
    setPlaceToEdit(place);
  };

  const updatePlace = async (id) => {
    if (editPlaceName !== "" && editPlaceZipCode !== "") {
      const body = {
        Name: editPlaceName,
        ZipCode: editPlaceZipCode,
      };

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };

      await fetch(`http://localhost:5077/api/Place/${id}`, requestOptions)
        .then((response) => console.log(response))
        .then((data) => console.log(data));
    }
    setIsEdit(false);
  };

  const submitNewPlace = async () => {
    if (
      newPlaceCountry !== "" &&
      newPlaceName !== "" &&
      newPlaceZipCode !== ""
    ) {
      const newPlace = {
        Name: newPlaceName,
        CountryofPlace: newPlaceCountry,
        ZipCode: newPlaceZipCode,
      };

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlace),
      };

      await fetch("http://localhost:5077/api/Place", requestOptions)
        .then((response) => console.log(response))
        .then((data) => console.log(data));
      setClicked(!clicked);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5077/api/Country")
      .then((res) => res.json())
      .then((data) => setAllCountries(data));

    fetch("http://localhost:5077/api/Place/1")
      .then((res) => res.json())
      .then((data) => {
        setPlacesPerPage(data.places);
        setPlaceObject(data);
      });
  }, [clicked, isEdit, changePage]);

  return (
    <>
      {!isEdit && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "150px",
          }}
        >
          <div style={{ width: "30rem", height: "40rem" }}>
            <div style={{ display: "flex" }}>
              <div
                id="table"
                style={{
                  display: "inline-block",
                }}
              >
                <table border="1px solid black">
                  <thead>
                    <tr>
                      <th style={{ padding: "2rem" }}>Name</th>
                      <th style={{ padding: "2rem" }}>ZipCode</th>
                      <th style={{ padding: "2rem" }}>Country</th>
                      <th style={{ padding: "2rem" }}>Actions</th>
                    </tr>
                  </thead>
                  {placesPerPage &&
                    placesPerPage.map((place) => {
                      return (
                        <tbody>
                          <tr>
                            <td style={{ padding: "2rem" }}>{place.place}</td>
                            <td style={{ padding: "2rem" }}>{place.zipcode}</td>
                            <td style={{ padding: "2rem" }}>{place.country}</td>
                            <td style={{ padding: "2rem" }}>
                              <button
                                onClick={() => {
                                  setIsEdit(true);
                                  editPlace(place);
                                }}
                              >
                                Edit
                              </button>{" "}
                              <button
                                onClick={(event) => {
                                  deletePlace(place.id);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                </table>
              </div>

              <div
                id="addNewPlace"
                style={{
                  border: "1px solid black",
                  padding: "1rem",
                  display: "inline-block",
                }}
              >
                <h3>Add new place</h3>
                <div style={{ padding: "1rem" }}>
                  <label style={{ display: "block" }} htmlFor="countries">
                    Choose a country:{" "}
                  </label>
                  <select onChange={handleChangeCountry} name="countries">
                    {allCountries.map((country) => {
                      return (
                        <option value={country.countryName}>
                          {country.countryName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div style={{ padding: "1rem" }}>
                  <label style={{ display: "block" }} htmlFor="placeName">
                    Place name:{" "}
                  </label>
                  <input onChange={handleChangePlace} name="placeName"></input>
                </div>

                <div style={{ padding: "1rem" }}>
                  <label style={{ display: "block" }} htmlFor="zipcode">
                    ZipCode:{" "}
                  </label>
                  <input onChange={handleChangeZipCode} name="zipcode"></input>
                </div>

                <button onClick={submitNewPlace} style={{ padding: "1rem" }}>
                  Add New Place
                </button>
              </div>
            </div>
            <div
              id="currentPage"
              style={{ border: "1px solid black", padding: "1rem" }}
            >
              <h3>
                Current Page:{" "}
                {placeObject && (
                  <span>
                    {placeObject.currentPage}/{placeObject.pages}
                  </span>
                )}
              </h3>
              <label htmlFor="gotopage">Go to page: </label>
              <input
                onChange={(event) => setChangePage(event.target.value)}
                name="gotopage"
              ></input>
              <button onClick={handlePage}>GO!</button>
            </div>
          </div>
        </div>
      )}
      {isEdit && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "150px",
            border: "1px solid black",
          }}
        >
          <div style={{}}>
            <span style={{ padding: "1rem" }}>{placeToEdit.country}</span>

            <div>
              <label htmlFor="name">Name: </label>
              <input
                onChange={(event) => setEditPlaceName(event.target.value)}
                name="name"
              ></input>
            </div>

            <div>
              <label htmlFor="zipcode">ZipCode: </label>
              <input
                onChange={(event) => setEditPlaceZipCode(event.target.value)}
                name="zipcode"
              ></input>
            </div>

            <button
              style={{ display: "block" }}
              onClick={() => {
                updatePlace(placeToEdit.id);
              }}
            >
              Update
            </button>

            <button
              style={{ display: "block" }}
              onClick={() => {
                setIsEdit(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
