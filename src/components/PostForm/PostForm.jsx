import { useMemo, useState, useRef } from 'react';
import { FiUploadCloud, FiEdit2, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

import BlockEditor from '../BlockEditor/BlockEditor';

import './PostForm.scss';
function PostForm() {
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [category, setCategory] = useState('Tin tổng hợp');
  const [blocks, setBlocks] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSites, setSelectedSites] = useState([]);
  const [openSites, setOpenSites] = useState(false);

  const thumbnailUrl = useMemo(
    () => (thumbnail ? URL.createObjectURL(thumbnail) : ''),
    [thumbnail]
  );

  const dropRef = useRef(null);

  // Danh sách các trang web
  const availableSites = [
    { id: 'vinhomecangio', name: 'Vinhomes Green Paradise', url: 'http://vinhomes.org.vn/' },
    { id: 'thegioriverside', name: 'The Gió Riverside', url: 'http://angia.org.vn/' },
    { id: 'example', name: 'Example', url: 'http://example.com.vn' },
  ];

  const handleSiteToggle = (siteUrl) => {
    setSelectedSites((prev) =>
      prev.includes(siteUrl) ? prev.filter((url) => url !== siteUrl) : [...prev, siteUrl]
    );
  };

  const handleSelectAllSites = () => {
    setSelectedSites(availableSites.map((site) => site.url));
  };

  const handleDeselectAllSites = () => {
    setSelectedSites([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }
    if (!thumbnail) {
      toast.error('Vui lòng chọn ảnh đại diện');
      return;
    }
    if (!blocks.length) {
      toast.error('Vui lòng thêm nội dung bài viết');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('thumbnail', thumbnail);

      // Xử lý blocks và tách file ảnh
      const processedBlocks = [];
      const imageFiles = [];

      blocks.forEach((block) => {
        if (block.type === 'image' && block.content instanceof File) {
          // Lưu file ảnh và thay content bằng tên file
          imageFiles.push(block.content);
          processedBlocks.push({
            ...block,
            content: block.content.name,
          });
        } else {
          processedBlocks.push(block);
        }
      });

      // Thêm các file ảnh từ blocks
      imageFiles.forEach((file) => {
        formData.append('blockImages', file);
      });

      formData.append('blocks', JSON.stringify(processedBlocks));
      formData.append('category', category);
      formData.append('author', 'Admin');
      formData.append(
        'targetSites',
        JSON.stringify(
          selectedSites.length > 0 ? selectedSites : availableSites.map((site) => site.url)
        )
      );

      const response = await axios.post('http://localhost:5000/api/v1/news/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Đăng tin tức thành công!');
        // Reset form
        setTitle('');
        setThumbnail(null);
        setCategory('Tin tổng hợp');
        setBlocks([]);
        setSelectedSites([]);
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng tin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) setThumbnail(file);
  };

  const prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="page-header">
        <div>
          <h1>Đăng tin tức mới</h1>
          <p className="subtitle">Tạo và xem trước tin tức trước khi đăng</p>
        </div>
        <div className="actions">
          <button type="button" className="btn outline">
            <FiEdit2 /> Chỉnh sửa
          </button>
          <button type="button" className="btn outline">
            <FiEye /> Xem trước
          </button>
        </div>
      </div>
      <label>Tiêu đề *</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Danh mục *</label>
      <div className="dropdown" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="dropdown-toggle control"
          onClick={() => setOpenCategory(!openCategory)}
        >
          {category}
        </button>
        {openCategory && (
          <div className="dropdown-menu" onMouseLeave={() => setOpenCategory(false)}>
            {['Tin tổng hợp', 'Thông cáo', 'Sự kiện'].map((opt) => (
              <div
                key={opt}
                className={`dropdown-item ${opt === category ? 'active' : ''}`}
                onClick={() => {
                  setCategory(opt);
                  setOpenCategory(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>

      <label>Chọn trang web đăng tin *</label>
      <div className="dropdown" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="dropdown-toggle control"
          onClick={() => setOpenSites(!openSites)}
        >
          {selectedSites.length === 0
            ? 'Tất cả trang web'
            : selectedSites.length === availableSites.length
            ? 'Tất cả trang web'
            : `${selectedSites.length} trang web đã chọn`}
        </button>
        {openSites && (
          <div className="dropdown-menu sites-menu" onMouseLeave={() => setOpenSites(false)}>
            <div className="dropdown-actions">
              <button type="button" className="action-btn" onClick={handleSelectAllSites}>
                Chọn tất cả
              </button>
              <button type="button" className="action-btn" onClick={handleDeselectAllSites}>
                Bỏ chọn tất cả
              </button>
            </div>
            {availableSites.map((site) => (
              <div
                key={site.id}
                className={`dropdown-item ${selectedSites.includes(site.url) ? 'active' : ''}`}
                onClick={() => handleSiteToggle(site.url)}
              >
                <input
                  type="checkbox"
                  checked={selectedSites.includes(site.url)}
                  onChange={() => {}} // Controlled by onClick
                />
                <span>{site.name}</span>
                <small>({site.url})</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <label>Ảnh đại diện *</label>
      <div
        ref={dropRef}
        className={`dropzone ${thumbnail ? 'has-file' : ''}`}
        onDrop={onDrop}
        onDragOver={prevent}
        onDragEnter={prevent}
        onDragLeave={prevent}
      >
        {thumbnail ? (
          <>
            <img className="drop-cover" src={thumbnailUrl} alt="thumbnail preview" />
            <button type="button" className="clear-overlay" onClick={() => setThumbnail(null)}>
              X
            </button>
          </>
        ) : (
          <div className="empty-state">
            <FiUploadCloud size={56} />
            <p>Kéo & thả ảnh vào đây hoặc</p>
            <label className="file-btn">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
              />
              Tải ảnh lên
            </label>
          </div>
        )}
      </div>

      <label>Nội dung bài viết</label>
      <BlockEditor blocks={blocks} setBlocks={setBlocks} />

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Đang đăng...' : 'Đăng tin tức'}
      </button>

      {/* <PreviewModal /> */}
    </form>
  );
}

export default PostForm;
