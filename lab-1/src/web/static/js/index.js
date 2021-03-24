$('#editModal').on('show.bs.modal', function (event) {
  const button = $(event.relatedTarget);
  const id = button.data('id');
  const title = button.data('title');
  const description = button.data('description');
  let dueDate = button.data('duedate');
  let attachments = button.data('attachments');

  $('#attachments').empty();

  if (attachments) {
    attachments = attachments.split(',');

    $('#attachment-body').removeClass('display-none');

    $.each(attachments, function (k, v) {
      const data = v.split('|');
      const id = data[0];
      const url = data[1];

      const fileName = url.split('/').reverse()[0];

      const layout = $(`
        <div class="card mb-3">
          <div class="card-body">
            <label class="float-left mb-0"><a href="${url}">Download file</a></label>
            <form action="/remove-attachment" method="POST" class="float-right">
              <input class="display-none" name="id" value="${id}"/>
              <input class="display-none" name="fileName" value="${fileName}"/>
              <button type="submit" class="btn-transparent">
                <i class="fas fa-trash-alt bucket"></i>
              </button>
            </form>
          </div>
        </div>`);

      $('#attachments').append(layout);
    });
  } else {
    $('#attachment-body').addClass('display-none');
  }

  dueDate = dueDate ? new Date(dueDate).toISOString().split('.')[0] : null;

  const modal = $(this);
  modal.find('.modal-body #id').val(id);
  modal.find('.modal-body #title').val(title);
  modal.find('.modal-body #description').val(description);
  modal.find('.modal-body #due-date').val(dueDate);
  modal.find('.modal-body #todo-item-id').val(id);
});
