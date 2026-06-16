function DataTable({ columns, data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return <div className="adm-empty">Belum ada data</div>
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="adm-table">
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
                <div className="adm-table-actions" style={{ justifyContent: "flex-end" }}>
                  <button className="adm-btn adm-btn-outline adm-btn-sm" style={{ marginRight: 8 }} onClick={() => onEdit(row)} title="Edit">
                    Edit
                  </button>
                  <button className="adm-btn adm-btn-outline danger adm-btn-sm" onClick={() => onDelete(row)} title="Hapus">
                    Hapus
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
