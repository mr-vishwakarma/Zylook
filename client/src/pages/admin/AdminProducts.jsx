import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Package, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../../services/productService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (category) params.category = category;
      
      const { data } = await productService.getProducts(params);
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      }
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [page, search, category]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate "${name}"?`)) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deactivated successfully');
      fetchProducts();
    } catch {
      toast.error('Failed to deactivate product');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-text)] tracking-tight">Products</h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-1">{total} total products in catalog.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors shadow-sm shadow-rose-500/20"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            placeholder="Search by name, brand, tags..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text)] text-sm rounded-xl pl-9 pr-4 py-2.5 focus:border-[var(--admin-text-muted)] outline-none transition-colors placeholder:text-[var(--admin-text-muted)]"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] text-sm rounded-xl px-4 py-2.5 outline-none appearance-none cursor-pointer min-w-[140px]"
        >
          <option value="">All Categories</option>
          <option value="topwear">Topwear</option>
          <option value="bottomwear">Bottomwear</option>
          <option value="footwear">Footwear</option>
          <option value="accessories">Accessories</option>
          <option value="outerwear">Outerwear</option>
          <option value="ethnic">Ethnic</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--admin-surface-hover)] border-b border-[var(--admin-border)] text-[var(--admin-text-muted)] text-[11px] font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Product</th>
                <th className="px-4 py-3.5">Category & Brand</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[var(--admin-text-muted)] text-sm">
                    <div className="w-6 h-6 border-2 border-[var(--admin-border)] border-t-rose-500 rounded-full animate-spin mx-auto mb-2" />
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[var(--admin-text-muted)] text-sm">
                    <Package size={24} className="mx-auto mb-2 opacity-50" />
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const totalStock = product.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0;
                  return (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-[var(--admin-surface-hover)] transition-colors"
                    >
                      {/* Product details */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-lg bg-[var(--admin-surface-hover)] border border-[var(--admin-border)] flex items-center justify-center overflow-hidden shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={16} className="text-[var(--admin-text-muted)]" />
                            )}
                          </div>
                          <div className="max-w-[200px] truncate">
                            <p className="text-sm font-bold text-[var(--admin-text)] truncate">{product.name}</p>
                            <p className="text-[10px] text-[var(--admin-text-muted)] truncate">ID: {product._id}</p>
                          </div>
                        </div>
                      </td>
                      
                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-[var(--admin-text)] capitalize">{product.category}</p>
                        <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">{product.brand}</p>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[var(--admin-text)]">
                            ₹{product.discountPrice > 0 ? product.discountPrice.toLocaleString() : product.price.toLocaleString()}
                          </span>
                          {product.discountPrice > 0 && (
                            <span className="text-[10px] text-[var(--admin-text-muted)] line-through">
                              ₹{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold
                          ${totalStock > 10 ? 'text-emerald-500 bg-emerald-500/10' : totalStock > 0 ? 'text-amber-500 bg-amber-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                          {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {product.isActive ? (
                          <span className="text-[11px] font-bold text-emerald-500">Active</span>
                        ) : (
                          <span className="text-[11px] font-bold text-[var(--admin-text-muted)]">Inactive</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </Link>
                          {product.isActive && (
                            <button
                              onClick={() => handleDelete(product._id, product.name)}
                              className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title="Deactivate"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3.5 border-t border-[var(--admin-border)] flex items-center justify-between">
            <span className="text-xs text-[var(--admin-text-muted)]">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
