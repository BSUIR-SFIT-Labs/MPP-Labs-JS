$('#editModal').on('show.bs.modal', function (event) {
  const button = $(event.relatedTarget);
  const id = button.data('id');
  const title = button.data('title');
  const description = button.data('description');
  let dueDate = button.data('duedate');

  dueDate = dueDate ? new Date(dueDate).toISOString().split('.')[0] : null;

  const modal = $(this);
  modal.find('.modal-body #id').val(id);
  modal.find('.modal-body #title').val(title);
  modal.find('.modal-body #description').val(description);
  modal.find('.modal-body #due-date').val(dueDate);
});
