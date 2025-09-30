import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { CodeField, Cursor, useClearByFocusCell } from "react-native-confirmation-code-field";

type PinInputProps = {
  length?: number; // number of digits (default 6)
  onComplete: (code: string) => void;
  resetKey?: any; // when this changes the input will clear
  cellStyle?: object;
  cellTextStyle?: object;
};

export default function PinInput({
  length = 6,
  onComplete,
  resetKey,
  cellStyle,
  cellTextStyle,
}: PinInputProps) {
  const [value, setValue] = useState("");
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // clear when resetKey changes (useful for multi-step confirm flows)
  useEffect(() => {
    setValue("");
  }, [resetKey]);

  // call onComplete when full length reached
  useEffect(() => {
    if (value.length === length) {
      // small delay to allow UI to show last digit before parent handles it
      const t = setTimeout(() => onComplete(value), 100);
      return () => clearTimeout(t);
    }
  }, [value, length, onComplete]);

  return (
    <CodeField
      {...props}
      value={value}
      onChangeText={setValue}
      cellCount={length}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => (
        <Text
          key={index}
          style={[
            styles.cell,
            isFocused && styles.focusCell,
            cellStyle,
            cellTextStyle ? {} : null,
          ]}
          onLayout={getCellOnLayoutHandler(index)}
        >
          {symbol ? "●" : isFocused ? <Cursor /> : null}
        </Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    width: 44,
    height: 56,
    lineHeight: 56,
    fontSize: 28,
    borderBottomWidth: 2,
    borderColor: "#ccc",
    textAlign: "center",
    marginHorizontal: 8,
  },
  focusCell: {
    borderColor: "#007AFF",
  },
});