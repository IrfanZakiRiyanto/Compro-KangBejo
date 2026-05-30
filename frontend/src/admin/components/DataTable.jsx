function DataTable({ columns, data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return <div className="ad-empty">Belum ada data</div>
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="ad-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.label}</th>
            ))}
            <th style={{ width: 100, textAlign: "right" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td style={{ textAlign: "right" }}>
                <div className="ad-table-actions" style={{ justifyContent: "flex-end" }}>
                  <button className="ad-btn-icon" onClick={() => onEdit(row)} title="Edit">
                    ✏️
                  </button>
                  <button className="ad-btn-icon danger" onClick={() => onDelete(row)} title="Hapus">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
