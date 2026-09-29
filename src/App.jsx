import { useState } from 'react'
import './App.css'

const STORAGE_KEY = 'income-ledger-categories'

function loadCategories() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function Icon({ name, size = 18 }) {
  const icons = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5m-18 4 9 5 9-5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  )
}

function App() {
  const [categories, setCategories] = useState(loadCategories)
  const [activePage, setActivePage] = useState('categories')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const filteredCategories = categories.filter((category) => {
    const search = query.trim().toLowerCase()
    return (
      category.name.toLowerCase().includes(search) ||
      category.description.toLowerCase().includes(search)
    )
  })

  function saveCategories(nextCategories) {
    setCategories(nextCategories)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCategories))
    } catch {
      setNotice('Changes could not be saved in this browser.')
    }
  }

  function addCategory(event) {
    event.preventDefault()

    const cleanName = name.trim()
    const cleanDescription = description.trim()

    if (!cleanName || !cleanDescription) {
      setError('Please complete both fields before saving.')
      return
    }

    if (
      categories.some(
        (category) => category.name.toLowerCase() === cleanName.toLowerCase(),
      )
    ) {
      setError('A category with this name already exists.')
      return
    }

    const newCategory = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      description: cleanDescription,
      createdAt: new Date().toISOString(),
    }

    saveCategories([newCategory, ...categories])
    setName('')
    setDescription('')
    setError('')
    setNotice(`${cleanName} has been added to your categories.`)
    window.setTimeout(() => setNotice(''), 3500)
  }

  function deleteCategory(category) {
    saveCategories(categories.filter((item) => item.id !== category.id))
    setNotice(`${category.name} was removed.`)
    window.setTimeout(() => setNotice(''), 3500)
  }

  const latestDate = categories.length
    ? new Date(categories[0].createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No entries yet'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#overview"
          aria-label="LEDGER home"
          onClick={(event) => {
            event.preventDefault()
            setActivePage('overview')
          }}
        >
          <span className="brand-mark"><Icon name="layers" size={21} /></span>
          <span className="brand-copy">
            <strong>LEDGER</strong>
            <small>INCOME WORKSPACE</small>
          </span>
        </a>

        <div className="nav-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          <button
            className={`nav-item ${activePage === 'overview' ? 'active' : ''}`}
            type="button"
            aria-current={activePage === 'overview' ? 'page' : undefined}
            onClick={() => setActivePage('overview')}
          >
            <Icon name="grid" />
            <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activePage === 'categories' ? 'active' : ''}`}
            type="button"
            aria-current={activePage === 'categories' ? 'page' : undefined}
            onClick={() => setActivePage('categories')}
          >
            <Icon name="layers" />
            <span>Categories</span>
            <span className="nav-count">{categories.length}</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-rule" />
          <span className="workspace-label">PERSONAL WORKSPACE</span>
          <div className="profile-row">
            <span className="avatar">U</span>
            <span>
              <strong>Your workspace</strong>
              <small>Income ledger</small>
            </span>
            <span className="profile-dot" />
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="crumb-divider">/</span>
            <strong>{activePage === 'overview' ? 'Overview' : 'Categories'}</strong>
          </div>
          <div className="topbar-right">
            <span className="status-dot" />
            <span>All changes saved</span>
            <span className="topbar-divider" />
            <span className="date-label">INCOME LEDGER</span>
          </div>
        </header>

        {activePage === 'overview' && (
          <div className="page-wrap overview-wrap">
            <section className="page-heading">
              <div>
                <div className="eyebrow"><span className="eyebrow-line" />AT A GLANCE</div>
                <h1>Overview</h1>
                <p className="page-subtitle">A quick look at the income sources in your ledger.</p>
              </div>
              <button className="heading-link" type="button" onClick={() => setActivePage('categories')}>
                <Icon name="layers" size={17} /> Manage categories
              </button>
            </section>

            <section className="stats-grid" aria-label="Ledger overview">
              <article className="stat-panel">
                <div className="stat-top">
                  <span className="stat-label">TOTAL CATEGORIES</span>
                  <span className="stat-icon teal"><Icon name="layers" size={18} /></span>
                </div>
                <div className="stat-value">{String(categories.length).padStart(2, '0')}</div>
                <div className="stat-foot">Income sources in your ledger</div>
              </article>
              <article className="stat-panel">
                <div className="stat-top">
                  <span className="stat-label">MOST RECENT ENTRY</span>
                  <span className="stat-icon amber"><Icon name="arrow" size={17} /></span>
                </div>
                <div className="stat-recent">{latestDate}</div>
                <div className="stat-foot">{categories.length ? categories[0].name : 'No category added yet'}</div>
              </article>
              <article className="stat-note">
                <span className="note-number">01</span>
                <div>
                  <strong>Keep your income organized.</strong>
                  <p>Add a category for each source, then use the categories view to search and manage your list.</p>
                </div>
                <span className="note-spark" aria-hidden="true">↗</span>
              </article>
            </section>

            <section className="overview-grid">
              <section className="list-panel overview-list" aria-labelledby="recent-categories-title">
                <div className="panel-heading">
                  <div>
                    <div className="section-kicker">RECENT ACTIVITY</div>
                    <h2 id="recent-categories-title">Recently added categories</h2>
                  </div>
                  <button className="text-action" type="button" onClick={() => setActivePage('categories')}>
                    View all <Icon name="arrow" size={14} />
                  </button>
                </div>
                {categories.length ? (
                  <div className="overview-category-list">
                    {categories.slice(0, 5).map((category, index) => (
                      <div className="overview-category-row" key={category.id}>
                        <span className={`category-symbol symbol-${index % 4}`}><Icon name="arrow" size={15} /></span>
                        <span className="overview-category-copy">
                          <strong>{category.name}</strong>
                          <span>{category.description}</span>
                        </span>
                        <time dateTime={category.createdAt}>
                          {new Date(category.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </time>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overview-empty">
                    <span className="empty-icon"><Icon name="layers" size={20} /></span>
                    <strong>Your overview is ready</strong>
                    <span>Add your first category to see it summarized here.</span>
                    <button className="text-action" type="button" onClick={() => setActivePage('categories')}>
                      Add a category <Icon name="arrow" size={14} />
                    </button>
                  </div>
                )}
              </section>

              <aside className="overview-aside">
                <span className="overview-aside-icon"><Icon name="grid" size={19} /></span>
                <div className="section-kicker">YOUR WORKSPACE</div>
                <h2>One place for every income source.</h2>
                <p>Your category details are saved in this browser and stay available when you return.</p>
                <button className="overview-manage" type="button" onClick={() => setActivePage('categories')}>
                  Open categories <Icon name="arrow" size={15} />
                </button>
              </aside>
            </section>

            <footer className="page-footer">
              <span>LEDGER <span className="footer-dot">/</span> INCOME MANAGEMENT</span>
              <span>Organized finances start with clear categories.</span>
            </footer>
          </div>
        )}

        {activePage === 'categories' && <div className="page-wrap">
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                YOUR FINANCES, ORGANIZED
              </div>
              <h1>Income categories</h1>
              <p className="page-subtitle">
                Build a clear picture of where your income comes from.
              </p>
            </div>
            <a className="heading-link" href="#add-category">
              <Icon name="plus" size={17} />
              New category
            </a>
          </section>

          <section className="stats-grid" aria-label="Category summary">
            <article className="stat-panel">
              <div className="stat-top">
                <span className="stat-label">TOTAL CATEGORIES</span>
                <span className="stat-icon teal"><Icon name="layers" size={18} /></span>
              </div>
              <div className="stat-value">{String(categories.length).padStart(2, '0')}</div>
              <div className="stat-foot">
                <span className="stat-indicator"><Icon name="arrow" size={13} /></span>
                {categories.length} income {categories.length === 1 ? 'stream' : 'streams'} tracked
              </div>
            </article>

            <article className="stat-panel">
              <div className="stat-top">
                <span className="stat-label">MOST RECENT ENTRY</span>
                <span className="stat-icon amber"><Icon name="arrow" size={17} /></span>
              </div>
              <div className="stat-recent">{latestDate}</div>
              <div className="stat-foot">
                {categories.length ? 'Latest category added' : 'Your ledger is ready to begin'}
              </div>
            </article>

            <article className="stat-note">
              <span className="note-number">01</span>
              <div>
                <strong>Start with the source.</strong>
                <p>
                  Give each income stream a name and a short description. Keep
                  your ledger easy to scan.
                </p>
              </div>
              <span className="note-spark" aria-hidden="true">↗</span>
            </article>
          </section>

          <section className="workspace-grid" id="categories">
            <section className="list-panel" aria-labelledby="category-list-title">
              <div className="panel-heading">
                <div>
                  <div className="section-kicker">YOUR LEDGER</div>
                  <h2 id="category-list-title">
                    Registered categories <span className="heading-count">{categories.length}</span>
                  </h2>
                </div>
                <label className="search-box">
                  <Icon name="search" size={17} />
                  <span className="visually-hidden">Search categories</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search categories..."
                  />
                </label>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">CATEGORY</th>
                      <th scope="col">DESCRIPTION</th>
                      <th scope="col">DATE ADDED</th>
                      <th scope="col"><span className="visually-hidden">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody id="listIncomeCat">
                    {filteredCategories.map((category, index) => (
                      <tr key={category.id} style={{ '--row-index': index }}>
                        <td>
                          <div className="category-cell">
                            <span className={`category-symbol symbol-${index % 4}`}>
                              <Icon name="arrow" size={15} />
                            </span>
                            <strong>{category.name}</strong>
                          </div>
                        </td>
                        <td className="description-cell">{category.description}</td>
                        <td className="date-cell">
                          {new Date(category.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="action-cell">
                          <button
                            className="icon-button"
                            type="button"
                            onClick={() => deleteCategory(category)}
                            aria-label={`Delete ${category.name}`}
                            title="Delete category"
                          >
                            <Icon name="trash" size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredCategories.length === 0 && (
                      <tr>
                        <td className="empty-cell" colSpan="4">
                          <span className="empty-icon">
                            <Icon name={query ? 'search' : 'layers'} size={20} />
                          </span>
                          <strong>
                            {query ? 'No matching categories' : 'Your ledger starts here'}
                          </strong>
                          <span>
                            {query
                              ? 'Try another name or description.'
                              : 'Add your first income category using the form.'}
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <span>
                  Showing <strong>{filteredCategories.length}</strong> of{' '}
                  <strong>{categories.length}</strong> categories
                </span>
                <span className="local-save"><Icon name="check" size={14} /> Saved on this device</span>
              </div>
            </section>

            <aside className="form-panel" id="add-category">
              <div className="form-topline">
                <span className="form-icon"><Icon name="plus" size={18} /></span>
                <span className="form-step">NEW ENTRY <span>·</span> 01</span>
              </div>
              <h2>Add a category</h2>
              <p className="form-intro">Capture a new source of income in your ledger.</p>

              <form id="categoryForm" onSubmit={addCategory}>
                <label className="field-label" htmlFor="txtCatName">
                  Category name <span>REQUIRED</span>
                </label>
                <input
                  id="txtCatName"
                  className="text-input"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    setError('')
                  }}
                  placeholder="e.g. Consulting"
                  maxLength="48"
                  required
                />

                <label className="field-label description-label" htmlFor="txtCatDesc">
                  Description <span>REQUIRED</span>
                </label>
                <textarea
                  id="txtCatDesc"
                  className="text-input description-input"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value)
                    setError('')
                  }}
                  placeholder="What does this income stream include?"
                  maxLength="180"
                  rows="3"
                  required
                />

                <div className="field-hint">
                  A short note helps you recognize this stream later.
                </div>
                {error && <div className="form-error" role="alert">{error}</div>}
                <button id="btnAdd" className="submit-button" type="submit">
                  Save category <Icon name="arrow" size={16} />
                </button>
                <div className="privacy-note">
                  <span className="privacy-mark"><Icon name="check" size={12} /></span>
                  Stored privately in this browser
                </div>
              </form>
            </aside>
          </section>

          <footer className="page-footer">
            <span>LEDGER <span className="footer-dot">/</span> INCOME MANAGEMENT</span>
            <span>Organized finances start with clear categories.</span>
          </footer>
        </div>}

        {notice && (
          <div className="toast" role="status">
            <span className="toast-check"><Icon name="check" size={15} /></span>
            {notice}
            <button
              type="button"
              className="toast-close"
              onClick={() => setNotice('')}
              aria-label="Dismiss notification"
            >
              <Icon name="close" size={15} />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App