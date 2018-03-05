import React from "react";
import Downshift from "downshift";

function BasicAutocomplete({ items, onChange, defaultItem = null }) {
  return (
    <Downshift
      onChange={onChange}
      defaultSelectedItem={defaultItem}
      render={({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex
      }) => (
        <div>
          <input {...getInputProps({ placeholder: "Pick a topic" })} />
          {isOpen ? (
            <div style={{ border: "1px solid #ccc" }}>
              {items
                .filter(
                  i =>
                    !inputValue ||
                    i.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((item, index) => (
                  <div
                    {...getItemProps({ item })}
                    key={item}
                    style={{
                      backgroundColor:
                        highlightedIndex === index ? "gray" : "white",
                      fontWeight: selectedItem === item ? "bold" : "normal"
                    }}
                  >
                    {item}
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      )}
    />
  );
}

export const DropDown = ({
  onChange = selectedItem => console.log(selectedItem),
  defaultItem = null
}) => {
  return (
    <BasicAutocomplete
      items={require("../topiclist.json").topics}
      onChange={onChange}
      defaultItem={defaultItem}
    />
  );
};
