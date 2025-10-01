import { useState, useEffect, useRef } from 'react';
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
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import RichTextEditor from '../RichTextEditor';
import ListItemEditor from '../ListItemEditor';
import '../../styles/RichTextEditor.css';

import './BlockEditor.scss';

// Component Image Block
const ImageBlock = ({ block, onUpdate, onRemove, attributes, listeners, setNodeRef, style }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (block.content instanceof File) {
      const url = URL.createObjectURL(block.content);
      setImageUrl(url);

      // Cleanup URL 
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="block card">
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

// Sortable wrapper 
const SortableBlock = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return children({ setNodeRef, style, attributes, listeners });
};

function BlockEditor({ blocks, setBlocks }) {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    const withIds = (blocks || []).map((b) =>
      b && b.id ? b : { ...b, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }
    );
    let changed = false;
    for (let i = 0; i < withIds.length; i += 1) {
      if (blocks[i]?.id !== withIds[i]?.id) {
        changed = true;
        break;
      }
    }
    if (changed) setBlocks(withIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBlock = (type, e) => {
    e.preventDefault();
    const initialContent =
      type === 'heading' ? { level: 'H1', text: '' } : type === 'list' ? [''] : null;
    const newBlock = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      content: initialContent,
    };
    setBlocks([...(blocks || []), newBlock]);
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

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    setBlocks((items) => arrayMove(items, oldIndex, newIndex));
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block, idx) => {
              if (!block.id) return null;
              if (block.type === 'heading') {
                const value =
                  block.content && typeof block.content === 'object'
                    ? block.content
                    : { level: 'H2', text: '' };
                return (
                  <SortableBlock key={block.id} id={block.id}>
                    {({ setNodeRef, style, attributes, listeners }) => (
                      <div
                        ref={setNodeRef}
                        {...attributes}
                        {...listeners}
                        style={style}
                        className="block card"
                      >
                        <div className="block-header">
                          <div className="left">
                            <FiType className="block-icon" />
                            <span className="title">Heading</span>
                          </div>
                          <div
                            className="row"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                          >
                            <button
                              type="button"
                              className="pill danger"
                              onClick={() => removeBlock(idx)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        <div className="block-body">
                          <div className="row">
                            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                className="dropdown-toggle control"
                                onClick={() =>
                                  setOpenDropdownIndex(openDropdownIndex === idx ? null : idx)
                                }
                              >
                                {value.level}
                              </button>
                              {openDropdownIndex === idx && (
                                <div className="dropdown-menu">
                                  {['H1', 'H2', 'H3'].map((lv) => (
                                    <div
                                      key={lv}
                                      className={`dropdown-item ${
                                        lv === value.level ? 'active' : ''
                                      }`}
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
                            onChange={(e) =>
                              setBlockContent(idx, { ...value, text: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </SortableBlock>
                );
              }
              if (block.type === 'paragraph') {
                const value = block.content || [{ text: '' }];
                return (
                  <SortableBlock key={block.id} id={block.id}>
                    {({ setNodeRef, style, attributes, listeners }) => (
                      <div
                        ref={setNodeRef}
                        style={style}
                        {...attributes}
                        {...listeners}
                        className="block card"
                      >
                        <div className="block-header">
                          <div className="left">
                            <FiAlignLeft className="block-icon" />
                            <span className="title">Paragraph</span>
                          </div>
                          <div
                            className="row"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                          >
                            <button
                              type="button"
                              className="pill danger"
                              onClick={() => removeBlock(idx)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        <div className="block-body">
                          <RichTextEditor
                            value={value}
                            onChange={(newValue) => setBlockContent(idx, newValue)}
                            placeholder="Nhập nội dung đoạn văn..."
                          />
                        </div>
                      </div>
                    )}
                  </SortableBlock>
                );
              }
              if (block.type === 'image') {
                return (
                  <SortableBlock key={block.id} id={block.id}>
                    {({ setNodeRef, style, attributes, listeners }) => (
                      <ImageBlock
                        block={block}
                        attributes={attributes}
                        listeners={listeners}
                        setNodeRef={setNodeRef}
                        style={style}
                        onUpdate={(file) => handleImageUpdate(idx, file)}
                        onRemove={() => removeBlock(idx)}
                      />
                    )}
                  </SortableBlock>
                );
              }
              if (block.type === 'list') {
                const items = Array.isArray(block.content) ? block.content : [[{ text: '' }]];
                const setItem = (i, richTextValue) => {
                  const next = items.slice();
                  next[i] = richTextValue;
                  setBlockContent(idx, next);
                };
                const addItem = () => {
                  const next = [...items, [{ text: '' }]];
                  setBlockContent(idx, next);
                };
                const removeLast = () =>
                  setBlockContent(idx, items.length > 1 ? items.slice(0, -1) : items);
                return (
                  <SortableBlock key={block.id} id={block.id}>
                    {({ setNodeRef, style, attributes, listeners }) => (
                      <div
                        ref={setNodeRef}
                        style={style}
                        {...attributes}
                        {...listeners}
                        className="block card"
                      >
                        <div className="block-header">
                          <div className="left">
                            <FiList className="block-icon" />
                            <span className="title">List</span>
                          </div>
                          <div
                            className="row"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                          >
                            <button
                              type="button"
                              className="pill danger"
                              onClick={() => removeBlock(idx)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        <div className="block-body">
                          {items.map((item, i) => (
                            <div key={i} style={{ marginBottom: '8px' }}>
                              <ListItemEditor
                                value={item}
                                onChange={(newValue) => setItem(i, newValue)}
                                placeholder={`Mục ${i + 1}...`}
                              />
                            </div>
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
                    )}
                  </SortableBlock>
                );
              }
              return null;
            })}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

export default BlockEditor;
