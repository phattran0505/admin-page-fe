import React, { useState, useRef } from "react";
import { FiBold, FiItalic, FiLink, FiX } from "react-icons/fi";

function ListItemEditor({ value, onChange, placeholder = "Nhập mục..." }) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const inputRef = useRef(null);

  // Convert rich text array to display text
  const richTextToDisplay = (richTextArray) => {
    if (!Array.isArray(richTextArray)) return richTextArray || "";
    return richTextArray
      .map((item) => {
        if (typeof item === "string") return item;
        return item.text || "";
      })
      .join("");
  };

  // Convert display text to rich text array
  const displayToRichText = (text) => {
    return [{ text }];
  };

  const displayValue = richTextToDisplay(value);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    onChange(displayToRichText(newText));
  };

  const insertFormatting = (formatType) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selectedText = input.value.substring(start, end);

    if (!selectedText) {
      alert("Vui lòng chọn văn bản để định dạng");
      return;
    }

    let formattedText = "";
    switch (formatType) {
      case "bold":
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case "italic":
        formattedText = `<em>${selectedText}</em>`;
        break;
      case "link":
        setSelectedText(selectedText);
        setShowLinkDialog(true);
        return;
      default:
        return;
    }

    // Replace selected text with formatted text
    const newText =
      input.value.substring(0, start) +
      formattedText +
      input.value.substring(end);
    onChange(displayToRichText(newText));

    // Set cursor position after the inserted text
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length
      );
    }, 0);
  };

  const insertLink = () => {
    if (!linkUrl || !selectedText) return;

    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const linkText = `<a href="${linkUrl}" target="_blank">${selectedText}</a>`;
    const newText =
      input.value.substring(0, start) + linkText + input.value.substring(end);

    onChange(displayToRichText(newText));

    setShowLinkDialog(false);
    setLinkUrl("");
    setSelectedText("");

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + linkText.length, start + linkText.length);
    }, 0);
  };

  return (
    <div className="list-item-editor">
      <div className="toolbar">
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => insertFormatting("bold")}
          title="In đậm"
        >
          <FiBold />
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => insertFormatting("italic")}
          title="In nghiêng"
        >
          <FiItalic />
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => insertFormatting("link")}
          title="Thêm link"
        >
          <FiLink />
        </button>
      </div>

      <input
        ref={inputRef}
        className="control input rich-textarea"
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleTextChange}
      />

      {showLinkDialog && (
        <div className="link-dialog-overlay">
          <div className="link-dialog">
            <div className="dialog-header">
              <h4>Thêm liên kết</h4>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowLinkDialog(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="dialog-body">
              <p>
                Văn bản đã chọn: <strong>"{selectedText}"</strong>
              </p>
              <label>URL liên kết:</label>
              <input
                type="url"
                className="control input"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                autoFocus
              />
            </div>
            <div className="dialog-footer">
              <button
                type="button"
                className="btn outline"
                onClick={() => setShowLinkDialog(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={insertLink}
                disabled={!linkUrl}
              >
                Thêm liên kết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListItemEditor;
