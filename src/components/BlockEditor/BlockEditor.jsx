import { useState, useEffect } from 'react';
import {
  FiType,
  FiAlignLeft,
  FiImage,
  FiList,
  FiTrash2,
  FiPlus,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi';

import './BlockEditor.scss';

// Component riêng cho Image Block để sử dụng hooks đúng cách
const ImageBlock = ({ block, onUpdate, onRemove }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (block.content instanceof File) {
      const url = URL.createObjectURL(block.content);
      setImageUrl(url);

      // Cleanup URL khi component unmount hoặc file thay đổi
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageUrl('');
    }
  }, [block.content]);

  const handleImageUpload = (file) => {
    onUpdate(file);
  };

  const handleImageRemove = () => {
    onUpdate(null);
  };

  return (
    <div className="block card">
      <div className="block-header">
        <div className="left">
          <FiImage className="block-icon" />
          <span className="title">Image</span>
        </div>
        <button type="button" className="pill danger" onClick={onRemove}>
          <FiTrash2 />
        </button>
      </div>
      <div className="block-body">
        {block.content instanceof File ? (
          <div className="image-preview">
            <img src={imageUrl} alt="Preview" className="preview-image" />
            <button type="button" className="remove-image-btn" onClick={handleImageRemove}>
              <FiX size={16} />
            </button>
          </div>
        ) : (
          <div className="image-upload-area">
            <label className="upload-label">
              <FiUploadCloud size={24} />
              <span>Chọn ảnh</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

function BlockEditor({ blocks, setBlocks }) {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const addBlock = (type, e) => {
    e.preventDefault();
    const initialContent =
      type === 'heading' ? { level: 'H1', text: '' } : type === 'list' ? [''] : null;
    setBlocks([...(blocks || []), { type, content: initialContent }]);
  };

  const setBlockContent = (index, contentValue) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], content: contentValue };
    setBlocks(updated);
  };

  const removeBlock = (index) => {
    const updated = blocks.filter((_, i) => i !== index);
    setBlocks(updated);
  };

  const handleImageUpdate = (index, file) => {
    setBlockContent(index, file);
  };
  return (
    <>
      <div className="block-buttons ">
        <button type="button" onClick={(e) => addBlock('heading', e)}>
          Tiêu đề
        </button>
        <button type="button" onClick={(e) => addBlock('paragraph', e)}>
          Đoạn văn
        </button>
        <button type="button" onClick={(e) => addBlock('image', e)}>
          Hình ảnh
        </button>
        <button type="button" onClick={(e) => addBlock('list', e)}>
          Danh sách
        </button>
      </div>
      <div className="block-editor">
        {blocks.length === 0 && (
          <p className="empty">Chưa có nội dung nào. Hãy thêm block đầu tiên!</p>
        )}
        {blocks.map((block, idx) => {
          if (block.type === 'heading') {
            const value =
              block.content && typeof block.content === 'object'
                ? block.content
                : { level: 'H2', text: '' };
            return (
              <div key={idx} className="block card">
                <div className="block-header">
                  <div className="left">
                    <FiType className="block-icon" />
                    <span className="title">Heading</span>
                  </div>
                  <button type="button" className="pill danger" onClick={() => removeBlock(idx)}>
                    <FiTrash2 />
                  </button>
                </div>
                <div className="block-body">
                  <div className="row">
                    <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="dropdown-toggle control"
                        onClick={() => setOpenDropdownIndex(openDropdownIndex === idx ? null : idx)}
                      >
                        {value.level}
                      </button>
                      {openDropdownIndex === idx && (
                        <div className="dropdown-menu">
                          {['H1', 'H2', 'H3'].map((lv) => (
                            <div
                              key={lv}
                              className={`dropdown-item ${lv === value.level ? 'active' : ''}`}
                              onClick={() => {
                                setBlockContent(idx, { ...value, level: lv });
                                setOpenDropdownIndex(null);
                              }}
                            >
                              {lv}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    className="control input"
                    type="text"
                    placeholder="Nhập tiêu đề..."
                    value={value.text}
                    onChange={(e) => setBlockContent(idx, { ...value, text: e.target.value })}
                  />
                </div>
              </div>
            );
          }
          if (block.type === 'paragraph') {
            const value = typeof block.content === 'string' ? block.content : '';
            return (
              <div key={idx} className="block card">
                <div className="block-header">
                  <div className="left">
                    <FiAlignLeft className="block-icon" />
                    <span className="title">Paragraph</span>
                  </div>
                  <button type="button" className="pill danger" onClick={() => removeBlock(idx)}>
                    <FiTrash2 />
                  </button>
                </div>
                <div className="block-body">
                  <textarea
                    className="control textarea"
                    rows={5}
                    placeholder="Nhập nội dung đoạn văn..."
                    value={value}
                    onChange={(e) => setBlockContent(idx, e.target.value)}
                  />
                </div>
              </div>
            );
          }
          if (block.type === 'image') {
            return (
              <ImageBlock
                key={idx}
                block={block}
                onUpdate={(file) => handleImageUpdate(idx, file)}
                onRemove={() => removeBlock(idx)}
              />
            );
          }
          if (block.type === 'list') {
            const items = Array.isArray(block.content) ? block.content : [''];
            const setItem = (i, text) => {
              const next = items.slice();
              next[i] = text;
              setBlockContent(idx, next);
            };
            const addItem = () => setBlockContent(idx, [...items, '']);
            const removeLast = () =>
              setBlockContent(idx, items.length > 1 ? items.slice(0, -1) : items);
            return (
              <div key={idx} className="block card">
                <div className="block-header">
                  <div className="left">
                    <FiList className="block-icon" />
                    <span className="title">List</span>
                  </div>
                  <button type="button" className="pill danger" onClick={() => removeBlock(idx)}>
                    <FiTrash2 />
                  </button>
                </div>
                <div className="block-body">
                  {items.map((text, i) => (
                    <input
                      key={i}
                      className="control input"
                      type="text"
                      placeholder={`Mục ${i + 1}... `}
                      value={text}
                      onChange={(e) => setItem(i, e.target.value)}
                    />
                  ))}
                  <div className="row gap">
                    <button type="button" className="btn primary" onClick={addItem}>
                      <FiPlus /> Thêm mục
                    </button>
                    <button type="button" className="btn outline" onClick={removeLast}>
                      Xóa mục cuối
                    </button>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
}

export default BlockEditor;
