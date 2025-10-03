import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }], // color and background dropdowns
      [{ 'font': [] }, { 'size': [] }], // font and size dropdowns
      [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }], // text direction and alignment
      ['link', 'formula'],
      ['clean']
    ]
  };

  const formats = [
    // Inline formats
    'background', 'bold', 'color', 'font', 'code', 'italic', 'link',
    'size', 'strike', 'script', 'underline',
    
    // Block formats
    'blockquote', 'header', 'indent', 'list',
    
    // Alignment and direction
    'align', 'direction',
    
    // Code block
    'code-block',
    
    // Special formats
    'formula'
  ];

  return (
    <div>
      <style>
        {`
          .ql-toolbar .ql-header {
            color: #333 !important;
          }
          .ql-toolbar .ql-header:hover {
            color: #000 !important;
          }
          .ql-toolbar .ql-header.ql-active {
            color: #000 !important;
          }
        `}
      </style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: '200px', marginBottom: '40px' }}
      />
    </div>
  );
};

export default QuillEditor;