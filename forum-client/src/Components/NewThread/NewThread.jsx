import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewThread.module.css';

const categories = [
  { id: 1, icon: '🖥', name: 'Backend' },
  { id: 2, icon: '🎨', name: 'Frontend' },
  { id: 3, icon: '☁️', name: 'DevOps' },
  { id: 4, icon: '🔒', name: 'Security' },
  { id: 5, icon: '🗄', name: 'Databases' },
  { id: 6, icon: '📱', name: 'Mobile' },
  { id: 7, icon: '🤖', name: 'AI / ML' },
  { id: 8, icon: '🧪', name: 'Testing' },
];

export default function NewThread() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!newTag) return;
      if (tags.length >= 5) return;
      if (tags.includes(newTag)) return;
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (title.length > 150) newErrors.title = 'Title must be under 150 characters.';
    if (!content.trim()) newErrors.content = 'Content is required.';
    if (!selectedCategory) newErrors.category = 'Please select a category.';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Later this will POST to your .NET API
    alert('Thread posted! (will connect to API later)');
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Ask a Question</h1>
          <p className={styles.pageSubtitle}>Be specific and clear — good questions get great answers.</p>
        </div>

        {/* Title */}
        <div className={styles.field}>
          <label className={styles.label}>
            Title
            <span className={styles.required}>*</span>
          </label>
          <p className={styles.hint}>Summarize your question in one sentence.</p>
          <input
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            type="text"
            placeholder="e.g. How do I handle JWT refresh tokens in .NET 8?"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setErrors(err => ({ ...err, title: null }));
            }}
            maxLength={150}
          />
          <div className={styles.inputFooter}>
            {errors.title && <span className={styles.error}>{errors.title}</span>}
            <span className={styles.charCount}>{title.length}/150</span>
          </div>
        </div>

        {/* Category */}
        <div className={styles.field}>
          <label className={styles.label}>
            Category
            <span className={styles.required}>*</span>
          </label>
          <p className={styles.hint}>Pick the category that best fits your question.</p>
          <div className={styles.categoryGrid}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${styles.catBtn} ${selectedCategory === cat.id ? styles.catBtnActive : ''}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setErrors(err => ({ ...err, category: null }));
                }}
              >
                <span className={styles.catIcon}>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          {errors.category && <span className={styles.error}>{errors.category}</span>}
        </div>

        {/* Content */}
        <div className={styles.field}>
          <label className={styles.label}>
            Content
            <span className={styles.required}>*</span>
          </label>
          <p className={styles.hint}>Describe your problem in detail. Markdown is supported.</p>
          <textarea
            className={`${styles.textarea} ${errors.content ? styles.inputError : ''}`}
            placeholder={`What have you tried so far?\nWhat error are you getting?\nWhat is your expected behavior?`}
            value={content}
            onChange={e => {
              setContent(e.target.value);
              setErrors(err => ({ ...err, content: null }));
            }}
            rows={10}
          />
          {errors.content && <span className={styles.error}>{errors.content}</span>}
        </div>

        {/* Tags */}
        <div className={styles.field}>
          <label className={styles.label}>Tags</label>
          <p className={styles.hint}>Add up to 5 tags. Press Enter or comma to add.</p>
          <div className={styles.tagInputWrap}>
            {tags.map(tag => (
              <span key={tag} className={styles.tag}>
                {tag}
                <button
                  className={styles.tagRemove}
                  onClick={() => handleRemoveTag(tag)}
                >×</button>
              </span>
            ))}
            {tags.length < 5 && (
              <input
                className={styles.tagInput}
                type="text"
                placeholder="e.g. react, postgresql..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.btnOutline} onClick={() => navigate('/')}>
            Cancel
          </button>
          <button className={styles.btnPrimary} onClick={handleSubmit}>
            Post Thread
          </button>
        </div>

      </div>
    </div>
  );
}