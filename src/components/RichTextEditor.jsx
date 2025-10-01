import { useState, useRef } from 'react';
import { FiBold, FiItalic, FiLink, FiX } from 'react-icons/fi';

function RichTextEditor({ value, onChange, placeholder = "Nhập nội dung..." }) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const textareaRef = useRef(null);

  // Convert rich text array to display text
  const richTextToDisplay = (richTextArray) => {
    if (!Array.isArray(richTextArray)) return richTextArray || '';
    return richTextArray.map(item => {
      if (typeof item === 'string') return item;
      return item.text || '';
    }).join('');
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

//   const getSelectedText = () => {
//     const textarea = textareaRef.current;
//     if (!textarea) return '';
    
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     return textarea.value.substring(start, end);
//   };

  const insertFormatting = (formatType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    if (!selectedText) {
      alert('Vui lòng chọn văn bản để định dạng');
      return;
    }

    let formattedText = '';
    switch (formatType) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'link':
        setSelectedText(selectedText);
        setShowLinkDialog(true);
        return;
      default:
        return;
    }

    // Replace selected text with formatted text
    const newText = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    onChange(displayToRichText(newText));

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const insertLink = () => {
    if (!linkUrl || !selectedText) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const linkText = `<a href="${linkUrl}" target="_blank">${selectedText}</a>`;
    const newText = textarea.value.substring(0, start) + linkText + textarea.value.substring(end);
    
    onChange(displayToRichText(newText));
    
    setShowLinkDialog(false);
    setLinkUrl('');
    setSelectedText('');

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + linkText.length, start + linkText.length);
    }, 0);
  };

  return (
    <div className="rich-text-editor">
      <div className="toolbar">
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => insertFormatting('bold')}
          title="In đậm (Ctrl+B)"
        >
          <FiBold />
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => insertFormatting('italic')}
          title="In nghiêng (Ctrl+I)"
        >
          <FiItalic />
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => insertFormatting('link')}
          title="Thêm link"
        >
          <FiLink />
        </button>
      </div>
      
      <textarea
        ref={textareaRef}
        className="control textarea rich-textarea"
        rows={5}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleTextChange}
      />

      <div className="format-help">
        <small>
          💡 Chọn văn bản và nhấn nút định dạng, hoặc sử dụng HTML: 
          <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;a href="..."&gt;</code>
        </small>
      </div>

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
              <p>Văn bản đã chọn: <strong>"{selectedText}"</strong></p>
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

export default RichTextEditor;